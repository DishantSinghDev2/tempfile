// src/app/api/cron/cleanup/route.ts
// Called by Cloudflare Workers Cron Trigger every hour
// Handles: expired file cleanup, storage tier demotions, quota enforcement

import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db/client";
import { eq, lt, and, sql } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const { env } = getCloudflareContext();
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const now = new Date();
  let cleaned = 0;

  // 1. Mark expired files
  const expired = await db
    .update(schema.files)
    .set({ status: "expired" })
    .where(
      and(
        eq(schema.files.status, "active"),
        lt(schema.files.expiresAt, now)
      )
    );

  // 2. Find files to actually delete (expired > 1 hour ago)
  const toDelete = await db
    .select({
      id: schema.files.id,
      storageKey: schema.files.storageKey,
      storageTier: schema.files.storageTier,
      sha256: schema.files.sha256,
      userId: schema.files.userId,
      size: schema.files.size,
    })
    .from(schema.files)
    .where(
      and(
        eq(schema.files.status, "expired"),
        lt(
          schema.files.expiresAt,
          new Date(now.getTime() - 60 * 60 * 1000) // 1h grace period
        )
      )
    )
    .limit(100); // Batch to avoid timeout

  for (const file of toDelete) {
    try {
      // Remove from R2 if it was promoted
      if (file.storageTier === "r2_hot" && env?.FILE_BUCKET) {
        await env.FILE_BUCKET.delete(file.storageKey);
      }
      
      // GCS deletion happens via a separate scheduled GCS lifecycle rule
      // (GCS Object Lifecycle Management handles actual GCS deletions)

      // Remove dedup cache entry
      if (env?.DEDUP_KV) {
        await env.DEDUP_KV.delete(`hash:${file.sha256}`);
      }

      // Mark as deleted in DB
      await db
        .update(schema.files)
        .set({ status: "deleted", deletedAt: now })
        .where(eq(schema.files.id, file.id));

      // Decrement user's active storage securely (SQLite MAX() function handling)
      if (file.userId) {
        await db
          .update(schema.users)
          .set({
            activeStorageBytes: sql`CASE WHEN ${schema.users.activeStorageBytes} - ${file.size} < 0 THEN 0 ELSE ${schema.users.activeStorageBytes} - ${file.size} END`,
          })
          .where(eq(schema.users.id, file.userId));
      }

      cleaned++;
    } catch (err) {
      console.error(`Failed to clean file ${file.id}:`, err);
    }
  }

  // 3. Enforce storage quotas: delete oldest files for users over limit
  const FREE_QUOTA_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB
  const overQuota = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(
      and(
        eq(schema.users.planTier, "free"),
        sql`${schema.users.activeStorageBytes} > ${FREE_QUOTA_BYTES}`
      )
    )
    .limit(50);

  for (const user of overQuota) {
    // Get oldest active files for this user
    const oldestFiles = await db
      .select({ id: schema.files.id })
      .from(schema.files)
      .where(
        and(eq(schema.files.userId, user.id), eq(schema.files.status, "active"))
      )
      .orderBy(sql`${schema.files.createdAt} ASC`)
      .limit(5);

    for (const file of oldestFiles) {
      await db
        .update(schema.files)
        .set({ status: "expired" })
        .where(eq(schema.files.id, file.id));
    }
  }

  return NextResponse.json({
    success: true,
    cleaned,
    timestamp: now.toISOString(),
  });
}
