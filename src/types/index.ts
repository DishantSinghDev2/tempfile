// src/types/index.ts

export type PlanTier = "free" | "pro" | "starter" | "enterprise";
export type FileStatus = "pending" | "active" | "expired" | "deleted";
export type StorageTier = "gcs_standard" | "r2_hot" | "gcs_nearline" | "deleted";

export interface FileRecord {
  id: string;
  shareId: string;
  userId: string | null;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  sha256: string;
  storageKey: string;
  storageTier: StorageTier;
  downloadCount: number;
  maxDownloads: number | null;
  expiresAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
  uploaderIp: string | null;
  firstDownloaderIp: string | null;
  status: FileStatus;
  isDeduped: boolean;
  dedupedFromId: string | null;
}

export interface UploadRequest {
  filename: string;
  mimeType: string;
  size: number;
  sha256: string;
  expiryHours?: number;
  maxDownloads?: number | null;
  password?: string | null;
}

export interface UploadResponse {
  shareId: string;
  uploadUrl?: string;
  alreadyExists?: boolean;
  expiresAt: string;
}

export interface SharePageData {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads: number | null;
  isExpired: boolean;
  requiresPassword: boolean;
}

export type Plan = {
  id: string;
  name: string;
  tier: PlanTier;
  priceMonthly: number;
  priceYearly: number;
  paddlePriceIdMonthly: string;
  paddlePriceIdYearly: string;
  maxFileSizeMb: number;
  maxStorageGb: number;
  maxExpiryDays: number;
  maxDownloads: number | null;
  features: string[];
  creditsMonthly: number;
};

export interface UserSubscription {
  id: string;
  userId: string;
  paddleSubscriptionId: string;
  paddleCustomerId: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  planTier: PlanTier;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  creditsRemaining: number;
  creditsResetAt: Date;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export interface AbuseScore {
  uploadCount: number;
  totalGbToday: number;
  downloadBursts: number;
  score: number;
  blocked: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
