// src/lib/plans.ts
import type { Plan } from "@/types";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tier: "free",
    priceMonthly: 0,
    priceYearly: 0,
    paddlePriceIdMonthly: "",
    paddlePriceIdYearly: "",
    maxFileSizeMb: 100,
    maxStorageGb: 1,
    maxExpiryDays: 1,
    maxDownloads: 10,
    creditsMonthly: 0,
    features: [
      "Up to 100 MB per file",
      "24-hour auto-delete",
      "10 downloads per file",
      "No account required",
      "SHA-256 deduplication",
      "Direct upload (no proxy)",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    tier: "starter",
    priceMonthly: 5,
    priceYearly: 48,
    paddlePriceIdMonthly: process.env.PADDLE_STARTER_MONTHLY_ID ?? "",
    paddlePriceIdYearly: process.env.PADDLE_STARTER_YEARLY_ID ?? "",
    maxFileSizeMb: 500,
    maxStorageGb: 10,
    maxExpiryDays: 7,
    maxDownloads: null,
    creditsMonthly: 100,
    features: [
      "Up to 500 MB per file",
      "7-day expiry",
      "Unlimited downloads",
      "100 credits/month",
      "File history",
      "Custom expiry",
      "Priority CDN (R2 hot tier)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tier: "pro",
    priceMonthly: 15,
    priceYearly: 144,
    paddlePriceIdMonthly: process.env.PADDLE_PRO_MONTHLY_ID ?? "",
    paddlePriceIdYearly: process.env.PADDLE_PRO_YEARLY_ID ?? "",
    maxFileSizeMb: 2048,
    maxStorageGb: 50,
    maxExpiryDays: 30,
    maxDownloads: null,
    creditsMonthly: 500,
    features: [
      "Up to 2 GB per file",
      "30-day expiry",
      "Unlimited downloads",
      "500 credits/month",
      "Password protection",
      "Download analytics",
      "API access",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tier: "enterprise",
    priceMonthly: 99,
    priceYearly: 948,
    paddlePriceIdMonthly: process.env.PADDLE_ENTERPRISE_MONTHLY_ID ?? "",
    paddlePriceIdYearly: process.env.PADDLE_ENTERPRISE_YEARLY_ID ?? "",
    maxFileSizeMb: 10240,
    maxStorageGb: 500,
    maxExpiryDays: 365,
    maxDownloads: null,
    creditsMonthly: 5000,
    features: [
      "Up to 10 GB per file",
      "365-day expiry",
      "Unlimited everything",
      "5,000 credits/month",
      "Custom domain",
      "SLA guarantee",
      "Dedicated support",
      "Team accounts",
      "SSO / SAML",
    ],
  },
];

export const getPlan = (tier: string): Plan =>
  PLANS.find((p) => p.tier === tier) ?? PLANS[0];

export const MAX_FREE_FILE_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_PRO_FILE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
export const MAX_ENTERPRISE_FILE_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

export const BLOCKED_EXTENSIONS = [".torrent", ".exe", ".bat", ".scr"];
export const RESTRICTED_EXTENSIONS_FREE = [".iso", ".mkv"]; // Free users only
