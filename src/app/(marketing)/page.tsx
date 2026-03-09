// src/app/(marketing)/page.tsx
import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Temp File — Instant Secure File Sharing",
  description:
    "Share any file instantly with auto-expiring links. No account needed. SHA-256 deduplication, direct CDN uploads, zero proxy. Free up to 100 MB.",
  alternates: { canonical: "https://tempfile.io" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </>
  );
}
