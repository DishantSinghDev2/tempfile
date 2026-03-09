// src/app/api/upload/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { confirmUpload } from "@/lib/file-service";
import type { ApiResponse } from "@/types";
import { z } from "zod";

const schema = z.object({ shareId: z.string().min(1).max(20) });

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    await confirmUpload(parsed.data.shareId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Confirmation failed" }, { status: 500 });
  }
}
