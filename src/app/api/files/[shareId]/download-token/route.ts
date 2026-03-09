// src/app/api/files/[shareId]/download-token/route.ts
// Used for R2 hot-tier files - generates a short-lived token and redirects
import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getClientIp } from "@/lib/utils";
import { trackDownloadBurst } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const ip = getClientIp(request);

  await trackDownloadBurst(ip);

  const db = getDb();
  const [file] = await db
    .select()
    .from(schema.files)
    .where(
      and(
        eq(schema.files.shareId, shareId),
        eq(schema.files.storageTier, "r2_hot"),
        eq(schema.files.status, "active")
      )
    )
    .limit(1);

  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { env } = getCloudflareContext();
  const obj = await env.FILE_BUCKET.get(file.storageKey);

  if (!obj) {
    return NextResponse.json({ error: "File not in R2" }, { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", file.mimeType || "application/octet-stream");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(file.originalFilename)}"`
  );
  headers.set("Cache-Control", "private, no-store");
  headers.set("Content-Length", String(file.size));

  return new NextResponse(obj.body, { headers });
}
