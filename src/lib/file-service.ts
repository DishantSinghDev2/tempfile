// src/lib/file-service.ts
import { nanoid } from "nanoid";
import { eq, and, gt, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  createGCSUploadSignedUrl,
  createGCSDownloadSignedUrl,
  promoteFileToR2,
} from "@/lib/storage/gcs";
import type { UploadRequest, UploadResponse, SharePageData } from "@/types";
import {
  BLOCKED_EXTENSIONS,
  RESTRICTED_EXTENSIONS_FREE,
  getPlan,
} from "@/lib/plans";

const HOT_FILE_DOWNLOAD_THRESHOLD = 3;
const HOT_FILE_MIN_SIZE = 100 * 1024 * 1024; // 100 MB
const EARLY_DELETE_MIN_AGE_MINUTES = 30;

function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf(".")).toLowerCase();
}

/**
 * Sanitizes a filename to remove characters that are invalid in GCS object names,
 * and to prevent path traversal attacks.
 */
function sanitizeFilename(filename: string): string {
  // Replace slashes and backslashes with a safe character
  let sanitized = filename.replace(/[/\\]/g, "_");
  // Remove characters that are not allowed or problematic in GCS object names
  // This includes control characters, and characters like #, ?, etc.
  sanitized = sanitized.replace(/[\x00-\x1F\x7F#?\[\]*]/g, "");
  // Trim and ensure it's not empty
  return sanitized.trim() || "untitled";
}

function generateStorageKey(shareId: string, filename: string): string {
  const ext = getFileExtension(filename);
  return `files/${shareId}${ext}`;
}

export async function checkDeduplication(
  sha256: string
): Promise<{ exists: boolean; shareId?: string }> {
  const { env } = getCloudflareContext();

  // First check fast KV cache
  const cached = await env.DEDUP_KV.get(`hash:${sha256}`);
  if (cached) {
    return { exists: true, shareId: cached };
  }

  // Fall back to DB
  const db = getDb();
  const existing = await db
    .select({ shareId: schema.files.shareId, status: schema.files.status })
    .from(schema.files)
    .where(
      and(
        eq(schema.files.sha256, sha256),
        eq(schema.files.status, "active"),
        gt(schema.files.expiresAt, new Date())
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Cache for quick lookup
    await env.DEDUP_KV.put(`hash:${sha256}`, existing[0].shareId, {
      expirationTtl: 3600,
    });
    return { exists: true, shareId: existing[0].shareId };
  }

  return { exists: false };
}

export async function createFileRecord(
  req: UploadRequest,
  userId: string | null,
  uploaderIp: string,
  planTier: string = "free"
): Promise<UploadResponse> {
  const ext = getFileExtension(req.filename);
  const plan = getPlan(planTier);

  // Check blocked extensions
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    throw new Error(`File type ${ext} is not allowed`);
  }

  // Check restricted extensions for free users
  if (planTier === "free" && RESTRICTED_EXTENSIONS_FREE.includes(ext)) {
    throw new Error(`File type ${ext} requires a Pro account`);
  }

  // Check file size limit
  const maxBytes = plan.maxFileSizeMb * 1024 * 1024;
  if (req.size > maxBytes) {
    throw new Error(
      `File exceeds plan limit of ${plan.maxFileSizeMb} MB. Upgrade to upload larger files.`
    );
  }

  // Check deduplication
  const dedup = await checkDeduplication(req.sha256);
  if (dedup.exists && dedup.shareId) {
    // Create a new share record pointing to the same data
    const newShareId = nanoid(12);
    const { env } = getCloudflareContext();

    // Find original file to get storage key
    const db = getDb();
    const original = await db
      .select()
      .from(schema.files)
      .where(eq(schema.files.shareId, dedup.shareId))
      .limit(1);

    if (original.length > 0) {
      const expiryHours = req.expiryHours ?? plan.maxExpiryDays * 24;
      const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000);
      const fileId = nanoid(21);

      await db.insert(schema.files).values({
        id: fileId,
        shareId: newShareId,
        userId,
        filename: req.filename,
        originalFilename: req.filename,
        mimeType: req.mimeType,
        size: req.size,
        sha256: req.sha256,
        storageKey: original[0].storageKey,
        storageTier: original[0].storageTier,
        maxDownloads: req.maxDownloads ?? plan.maxDownloads,
        expiresAt: expiresAt,
        uploaderIp,
        status: "active",
        passwordHash: req.password ? req.password : null, // Simplification for now, should be hashed
        isDeduped: true,
        dedupedFromId: original[0].id,
      });

      // Cache new dedup hash
      await env.DEDUP_KV.put(`hash:${req.sha256}`, newShareId, {
        expirationTtl: 3600,
      });

      return {
        shareId: newShareId,
        alreadyExists: true,
        expiresAt: expiresAt.toISOString(),
      };
    }
  }

  // New file - create record and signed upload URL
  const shareId = nanoid(12);
  const fileId = nanoid(21);
  const sanitizedFilename = sanitizeFilename(req.filename);
  const storageKey = generateStorageKey(shareId, sanitizedFilename);
  const expiryHours =
    req.expiryHours ??
    (planTier === "free" ? 24 : plan.maxExpiryDays * 24);
  const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000);

  const db = getDb();
  await db.insert(schema.files).values({
    id: fileId,
    shareId,
    userId,
    filename: sanitizedFilename,
    originalFilename: req.filename,
    mimeType: req.mimeType,
    size: req.size,
    sha256: req.sha256,
    storageKey,
    storageTier: "gcs_standard",
    maxDownloads: req.maxDownloads ?? plan.maxDownloads,
    expiresAt,
    uploaderIp,
    status: "pending",
    passwordHash: req.password ? req.password : null,
    isDeduped: false,
  });

  const { env } = getCloudflareContext();
  const uploadUrl = await createGCSUploadSignedUrl({
    storageKey,
    mimeType: req.mimeType,
    maxSize: maxBytes,
    gcsBucket: env.GCS_BUCKET_NAME,
    clientEmail: env.GCS_CLIENT_EMAIL,
    privateKey: env.GCS_PRIVATE_KEY,
  });

  return {
    shareId,
    uploadUrl,
    alreadyExists: false,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function confirmUpload(shareId: string): Promise<void> {
  const db = getDb();
  const { env } = getCloudflareContext();

  await db
    .update(schema.files)
    .set({ status: "active" })
    .where(eq(schema.files.shareId, shareId));

  // Cache hash for dedup
  const file = await db
    .select({ sha256: schema.files.sha256 })
    .from(schema.files)
    .where(eq(schema.files.shareId, shareId))
    .limit(1);

  if (file.length > 0) {
    await env.DEDUP_KV.put(`hash:${file[0].sha256}`, shareId, {
      expirationTtl: 3600,
    });
  }
}

export async function getFileForDownload(
  shareId: string,
  downloaderIp: string
): Promise<{ downloadUrl: string; file: SharePageData } | null> {
  const db = getDb();
  const { env } = getCloudflareContext();

  const results = await db
    .select()
    .from(schema.files)
    .where(
      and(
        eq(schema.files.shareId, shareId),
        eq(schema.files.status, "active")
      )
    )
    .limit(1);

  if (results.length === 0) return null;

  const file = results[0];
  const now = new Date();

  // Check expiry
  if (file.expiresAt < now) {
    await db
      .update(schema.files)
      .set({ status: "expired" })
      .where(eq(schema.files.id, file.id));
    return null;
  }

  // Check download limit
  if (file.maxDownloads !== null && file.downloadCount >= file.maxDownloads) {
    return null;
  }

  // Increment download count
  const newCount = file.downloadCount + 1;
  const updates: Partial<typeof schema.files.$inferInsert> = {
    downloadCount: newCount,
  };

  // Track first downloader for early delete logic
  if (!file.firstDownloaderIp) {
    updates.firstDownloaderIp = downloaderIp;
  }

  await db
    .update(schema.files)
    .set(updates)
    .where(eq(schema.files.id, file.id));

  // Early delete logic: single download by same IP after 30min
  const fileAgeMinutes =
    (now.getTime() - file.createdAt.getTime()) / (1000 * 60);
  if (
    newCount === 1 &&
    file.uploaderIp === downloaderIp &&
    fileAgeMinutes > EARLY_DELETE_MIN_AGE_MINUTES
  ) {
    // Schedule deletion in background
    setTimeout(() => scheduleEarlyDelete(file.id), 100);
  }

  // Hot file promotion: large file with many downloads → copy to R2
  if (
    file.size > HOT_FILE_MIN_SIZE &&
    newCount >= HOT_FILE_DOWNLOAD_THRESHOLD &&
    file.storageTier === "gcs_standard"
  ) {
    // Promote to R2 in background
    promoteFileToR2({
      storageKey: file.storageKey,
      gcsBucket: env.GCS_BUCKET_NAME,
      clientEmail: env.GCS_CLIENT_EMAIL,
      privateKey: env.GCS_PRIVATE_KEY,
      r2Bucket: env.FILE_BUCKET,
      mimeType: file.mimeType,
    }).then(() => {
      db.update(schema.files)
        .set({ storageTier: "r2_hot" })
        .where(eq(schema.files.id, file.id));
    });
  }

  let downloadUrl: string;

  // Serve from R2 if hot, otherwise from GCS
  if (file.storageTier === "r2_hot") {
    // R2 presigned URL
    const r2Object = await env.FILE_BUCKET.createMultipartUpload(
      file.storageKey
    );
    // Use a redirect approach for R2
    downloadUrl = `/api/files/${shareId}/download-token`;
  } else {
    downloadUrl = await createGCSDownloadSignedUrl({
      storageKey: file.storageKey,
      gcsBucket: env.GCS_BUCKET_NAME,
      clientEmail: env.GCS_CLIENT_EMAIL,
      privateKey: env.GCS_PRIVATE_KEY,
      filename: file.originalFilename,
    });
  }

  return {
    downloadUrl,
    file: {
      id: file.shareId,
      filename: file.originalFilename,
      size: file.size,
      mimeType: file.mimeType,
      expiresAt: file.expiresAt.toISOString(),
      downloadCount: newCount,
      maxDownloads: file.maxDownloads,
      isExpired: false,
      requiresPassword: !!file.passwordHash,
    },
  };
}

async function scheduleEarlyDelete(fileId: string): Promise<void> {
  try {
    const db = getDb();
    await db
      .update(schema.files)
      .set({ status: "deleted", deletedAt: new Date() })
      .where(eq(schema.files.id, fileId));
  } catch (err) {
    console.error("Early delete failed:", err);
  }
}

export async function getUserFiles(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const db = getDb();
  const offset = (page - 1) * limit;

  const files = await db
    .select()
    .from(schema.files)
    .where(eq(schema.files.userId, userId))
    .orderBy(sql`${schema.files.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  return files;
}

export async function deleteUserFile(
  fileId: string,
  userId: string
): Promise<boolean> {
  const db = getDb();

  const result = await db
    .update(schema.files)
    .set({ status: "deleted", deletedAt: new Date() })
    .where(
      and(eq(schema.files.id, fileId), eq(schema.files.userId, userId))
    );

  return true;
}
