// src/app/api/files/[shareId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import type { ApiResponse, SharePageData } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
): Promise<NextResponse<ApiResponse<SharePageData>>> {
  const { shareId } = await params;
  const db = getDb();

  const results = await db
    .select()
    .from(schema.files)
    .where(eq(schema.files.shareId, shareId))
    .limit(1);

  if (results.length === 0) {
    return NextResponse.json(
      { success: false, error: "File not found", code: "FILE_NOT_FOUND" },
      { status: 404 }
    );
  }

  const file = results[0];
  const isExpired = file.expiresAt < new Date() || file.status === "expired" || file.status === "deleted";

  const data: SharePageData = {
    id: file.shareId,
    filename: file.originalFilename,
    size: file.size,
    mimeType: file.mimeType,
    expiresAt: file.expiresAt.toISOString(),
    downloadCount: file.downloadCount,
    maxDownloads: file.maxDownloads,
    isExpired,
    requiresPassword: !!file.passwordHash,
  };

  return NextResponse.json({ success: true, data });
}
