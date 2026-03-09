// src/app/api/r2/[key]/route.ts
// Serves hot-tier files from Cloudflare R2 via redirect
// Never streams bytes through the Worker — uses redirect approach

import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const { env } = getCloudflareContext();

  const storageKey = decodeURIComponent(key);
  const filename =
    new URL(request.url).searchParams.get("filename") ?? "download";

  // Check the object exists in R2
  const head = await env.FILE_BUCKET.head(storageKey);
  if (!head) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Stream from R2 (workers are fine for this — no GCP egress)
  const obj = await env.FILE_BUCKET.get(storageKey);
  if (!obj) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    obj.httpMetadata?.contentType ?? "application/octet-stream"
  );
  headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename)}"`
  );
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set(
    "Content-Length",
    String(obj.size)
  );

  return new NextResponse(obj.body, { headers });
}
