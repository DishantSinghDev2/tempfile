// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createFileRecord } from "@/lib/file-service";
import { checkRateLimit, trackAbuseScore } from "@/lib/rate-limit";
import { getClientIp, verifyTurnstile } from "@/lib/utils";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { UploadRequest, ApiResponse, UploadResponse } from "@/types";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size: z.number().int().positive().max(10 * 1024 * 1024 * 1024), // 10 GB max
  sha256: z.string().length(64).regex(/^[a-f0-9]+$/),
  expiryHours: z.number().int().min(1).max(8760).optional(),
  maxDownloads: z.number().int().min(1).max(1000).nullable().optional(),
  turnstileToken: z.string().min(1),
  password: z.string().min(1).max(100).optional().nullable(),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<UploadResponse>>> {
  const ip = getClientIp(request);
  const { env } = getCloudflareContext();

  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;
    const planTier = (session?.user as { planTier?: string })?.planTier ?? "free";

    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    // Verify Turnstile
    const isHuman = await verifyTurnstile(
      parsed.data.turnstileToken,
      env.TURNSTILE_SECRET_KEY
    );
    if (!isHuman) {
      return NextResponse.json(
        {
          success: false,
          error: "Bot detected. Please complete the captcha.",
          code: "BOT_DETECTED",
        },
        { status: 403 }
      );
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(ip, planTier !== "free");
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please slow down.", code: "RATE_LIMITED" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }

    const { data: uploadRequest } = parsed;

    const uploadReq: UploadRequest = parsed.data;

    // Abuse scoring
    const abuse = await trackAbuseScore(ip, uploadReq.size);
    if (abuse.blocked) {
      return NextResponse.json(
        { success: false, error: "Suspicious activity detected. Please contact support.", code: "ABUSE_BLOCKED" },
        { status: 403 }
      );
    }

    const result = await createFileRecord(uploadReq, userId, ip, planTier);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json(
      { success: false, error: message, code: "UPLOAD_ERROR" },
      { status: 400 }
    );
  }
}
