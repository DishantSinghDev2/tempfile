// src/app/api/dedup/route.ts
// Public endpoint for developers to pre-check deduplication before upload
import { NextRequest, NextResponse } from "next/server";
import { checkDeduplication } from "@/lib/file-service";
import type { ApiResponse } from "@/types";
import { z } from "zod";

const schema = z.object({
  sha256: z.string().length(64).regex(/^[a-f0-9]+$/),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ exists: boolean; shareId?: string }>>> {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid sha256 hash" }, { status: 400 });
  }

  const result = await checkDeduplication(parsed.data.sha256);
  return NextResponse.json({ success: true, data: result });
}
