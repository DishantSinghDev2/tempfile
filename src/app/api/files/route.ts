// src/app/api/files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserFiles, deleteUserFile } from "@/lib/file-service";
import type { ApiResponse } from "@/types";

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const files = await getUserFiles(session.user.id, page, limit);
  return NextResponse.json({ success: true, data: files });
}

export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("id");
  if (!fileId) {
    return NextResponse.json({ success: false, error: "Missing file ID" }, { status: 400 });
  }

  await deleteUserFile(fileId, session.user.id);
  return NextResponse.json({ success: true });
}
