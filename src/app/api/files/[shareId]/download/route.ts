// src/app/api/files/[shareId]/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFileForDownload } from "@/lib/file-service";
import { trackDownloadBurst } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/utils";
import type { ApiResponse } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
): Promise<NextResponse> {
  const { shareId } = await params;
  const ip = getClientIp(request);
  const password = request.nextUrl.searchParams.get("password");

  await trackDownloadBurst(ip);

  try {
    const result = await getFileForDownload(shareId, ip, password);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "File not found, expired, or download limit reached", code: "FILE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Return redirect to signed URL (never proxy bytes through Worker)
    return NextResponse.redirect(result.downloadUrl, 302);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Download failed";
    return NextResponse.json(
      { success: false, error: message, code: "DOWNLOAD_ERROR" },
      { status: 403 }
    );
  }
}
