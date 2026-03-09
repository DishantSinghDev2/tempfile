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

  // Fetch form and customization
  const formResults = await db
    .select()
    .from(schema.fileForms)
    .where(eq(schema.fileForms.fileId, file.id))
    .limit(1);

  const customizationResults = await db
    .select()
    .from(schema.fileCustomizations)
    .where(eq(schema.fileCustomizations.fileId, file.id))
    .limit(1);

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
    form: formResults.length > 0 ? {
      id: formResults[0].id,
      title: formResults[0].title,
      description: formResults[0].description,
      fields: JSON.parse(formResults[0].fields),
      required: formResults[0].required,
      showAt: formResults[0].showAt,
    } : null,
    customization: customizationResults.length > 0 ? {
      theme: customizationResults[0].theme ? JSON.parse(customizationResults[0].theme) : null,
      donateButtonUrl: customizationResults[0].donateButtonUrl,
      customText: customizationResults[0].customText,
    } : null,
  };

  return NextResponse.json({ success: true, data });
}
