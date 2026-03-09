// src/lib/rate-limit.ts
import type { RateLimitResult, AbuseScore } from "@/types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const UPLOAD_LIMIT_PER_HOUR_FREE = 20;
const UPLOAD_LIMIT_PER_HOUR_PRO = 200;
const GB_LIMIT_PER_DAY_FREE = 1;
const ABUSE_SCORE_THRESHOLD = 80;

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

interface AbuseRecord {
  uploadCount: number;
  totalBytes: number;
  downloadBursts: number;
  lastReset: number;
}

export async function checkRateLimit(
  ip: string,
  isPro: boolean
): Promise<RateLimitResult> {
  const { env } = getCloudflareContext();
  const kv = env.RATE_LIMIT_KV;
  const key = `rl:upload:${ip}`;
  const limit = isPro
    ? UPLOAD_LIMIT_PER_HOUR_PRO
    : UPLOAD_LIMIT_PER_HOUR_FREE;
  const windowMs = 3600 * 1000; // 1 hour
  const now = Date.now();

  try {
    const raw = await kv.get(key);
    const record: RateLimitRecord = raw
      ? JSON.parse(raw)
      : { count: 0, windowStart: now };

    // Reset if window expired
    if (now - record.windowStart > windowMs) {
      record.count = 0;
      record.windowStart = now;
    }

    record.count++;
    const ttl = Math.ceil((record.windowStart + windowMs - now) / 1000);

    await kv.put(key, JSON.stringify(record), { expirationTtl: ttl });

    return {
      success: record.count <= limit,
      remaining: Math.max(0, limit - record.count),
      reset: Math.floor((record.windowStart + windowMs) / 1000),
    };
  } catch {
    // Fail open on KV errors
    return { success: true, remaining: limit, reset: 0 };
  }
}

export async function trackAbuseScore(
  ip: string,
  fileSizeBytes: number
): Promise<AbuseScore> {
  const { env } = getCloudflareContext();
  const kv = env.RATE_LIMIT_KV;
  const key = `abuse:${ip}`;
  const now = Date.now();
  const dayMs = 24 * 3600 * 1000;

  try {
    const raw = await kv.get(key);
    const record: AbuseRecord = raw
      ? JSON.parse(raw)
      : {
          uploadCount: 0,
          totalBytes: 0,
          downloadBursts: 0,
          lastReset: now,
        };

    // Reset daily counters
    if (now - record.lastReset > dayMs) {
      record.uploadCount = 0;
      record.totalBytes = 0;
      record.downloadBursts = 0;
      record.lastReset = now;
    }

    record.uploadCount++;
    record.totalBytes += fileSizeBytes;

    await kv.put(key, JSON.stringify(record), { expirationTtl: 86400 });

    // Calculate abuse score (0-100)
    const gbUsed = record.totalBytes / (1024 * 1024 * 1024);
    let score = 0;
    if (record.uploadCount > 50) score += 30;
    else if (record.uploadCount > 20) score += 15;
    if (gbUsed > GB_LIMIT_PER_DAY_FREE) score += 40;
    else if (gbUsed > 0.5) score += 20;
    if (record.downloadBursts > 100) score += 30;

    return {
      uploadCount: record.uploadCount,
      totalGbToday: gbUsed,
      downloadBursts: record.downloadBursts,
      score,
      blocked: score >= ABUSE_SCORE_THRESHOLD,
    };
  } catch {
    return {
      uploadCount: 0,
      totalGbToday: 0,
      downloadBursts: 0,
      score: 0,
      blocked: false,
    };
  }
}

export async function trackDownloadBurst(ip: string): Promise<void> {
  const { env } = getCloudflareContext();
  const kv = env.RATE_LIMIT_KV;
  const key = `abuse:${ip}`;

  try {
    const raw = await kv.get(key);
    if (raw) {
      const record: AbuseRecord = JSON.parse(raw);
      record.downloadBursts = (record.downloadBursts ?? 0) + 1;
      await kv.put(key, JSON.stringify(record), { expirationTtl: 86400 });
    }
  } catch {
    // noop
  }
}
