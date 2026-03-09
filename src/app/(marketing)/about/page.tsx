// src/app/(marketing)/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionMarker } from "@/components/ui/section-marker";

export const metadata: Metadata = {
  title: "About — Temp File",
  description:
    "Temp File is built on Cloudflare Workers and Google Cloud Storage. Learn about our architecture, mission, and cost-efficient design.",
  alternates: { canonical: "https://tempfile.io/about" },
};

export default function AboutPage() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-2xl mx-auto space-y-16">
        <FadeIn>
          <div className="space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              About
            </span>
            <h1 className="text-4xl font-semibold tracking-tight leading-[1.1] text-foreground">
              Built for the real cost of cloud.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Temp File is an open architecture for ephemeral file sharing. Every
              design decision — from SHA-256 dedup to early-delete triggers — is
              engineered to minimize GCP egress costs while maximizing user
              experience.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionMarker index={1} total={3} label="Architecture" />
          <div className="space-y-0">
            {[
              {
                label: "Zero-proxy uploads",
                desc: "Files go directly from your browser to Google Cloud Storage via a time-limited signed URL. Our Workers never receive a single file byte. This keeps compute costs near zero regardless of upload volume.",
              },
              {
                label: "SHA-256 deduplication",
                desc: "Before uploading, your browser computes a SHA-256 hash. If that exact file already exists on our platform, you receive a share link instantly — no upload, no storage consumed.",
              },
              {
                label: "Cloudflare R2 hot tier",
                desc: "Files that exceed 3 downloads and are larger than 100 MB are automatically copied to Cloudflare R2 for edge-cached delivery. GCP egress is replaced by Cloudflare's zero-egress R2.",
              },
              {
                label: "Smart deletion",
                desc: "Files expire on a configurable TTL. Additionally, if the same IP that uploaded a file downloads it once after 30 minutes, we schedule an early deletion — recovering storage that's clearly no longer needed.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="border-t border-border py-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4"
              >
                <p className="text-xs font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
            <div className="border-t border-border" />
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <SectionMarker index={2} total={3} label="Stack" />
          <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { layer: "Runtime", tech: "Cloudflare Workers" },
              { layer: "Framework", tech: "Next.js 15 + OpenNext" },
              { layer: "Database", tech: "Cloudflare D1 (SQLite)" },
              { layer: "ORM", tech: "Drizzle ORM" },
              { layer: "Primary Storage", tech: "Google Cloud Storage" },
              { layer: "CDN / Hot Tier", tech: "Cloudflare R2" },
              { layer: "Rate Limiting", tech: "Cloudflare KV" },
              { layer: "Auth", tech: "Auth.js v5 (next-auth)" },
              { layer: "Payments", tech: "Paddle" },
              { layer: "Blog", tech: "DITBlogs SDK" },
            ].map((item) => (
              <div key={item.layer} className="bg-background px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {item.layer}
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {item.tech}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <SectionMarker index={3} total={3} label="Get started" />
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Temp File is free to use with no account required. For larger
              files, longer expiry, and API access, check out our paid plans.
            </p>
            <div className="flex gap-3">
              <Link
                href="/"
                className="h-9 px-4 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
              >
                Upload a file
              </Link>
              <Link
                href="/pricing"
                className="h-9 px-4 text-xs font-mono border border-border text-foreground rounded-md flex items-center hover:bg-muted transition-colors"
              >
                View pricing
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
