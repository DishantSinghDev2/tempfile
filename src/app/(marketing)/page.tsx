// src/app/(marketing)/page.tsx
import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CTASection } from "@/components/marketing/cta-section";
import { auth } from "@/auth";
import { getPlan } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Temp File — Instant Secure File Sharing",
  description:
    "Share any file instantly with auto-expiring links. No account needed. SHA-256 deduplication, direct CDN uploads, zero proxy. Free up to 100 MB.",
  alternates: { canonical: "https://tempfile.io" },
};

export default async function HomePage() {
  const session = await auth();
  const planTier = (session?.user as any)?.planTier || "free";
  const plan = getPlan(planTier);

  return (
    <>
      <HeroSection 
        maxSizeMb={plan.maxFileSizeMb} 
        expiryHours={plan.maxExpiryDays * 24} 
        planTier={planTier} 
      />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </>
  );
}
