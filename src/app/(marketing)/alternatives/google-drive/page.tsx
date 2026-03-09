// src/app/(marketing)/alternatives/google-drive/page.tsx
import type { Metadata } from "next";
import { Check, X, Shield, Info, Database } from "lucide-react";
import { SectionMarker } from "@/components/ui/section-marker";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Temp File vs Google Drive — Why Ephemeral is Safer",
  description: "Stop leaving files exposed on Google Drive forever. See why Temp File is the better alternative for temporary sharing.",
};

export default function GoogleDriveComparison() {
  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-24">
        {/* Header */}
        <FadeIn>
          <div className="space-y-4 max-w-xl">
            <Link href="/alternatives" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              ← Back to alternatives
            </Link>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Temp File vs Google Drive
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Google Drive is built for collaboration. But for sharing a quick file with someone outside your organization, it's often insecure and messy.
            </p>
          </div>
        </FadeIn>

        {/* Comparison grid */}
        <div className="grid md:grid-cols-2 gap-16">
          <FadeIn className="space-y-6">
             <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">Permission Hell</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Permanent Exposure</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When you set a file on G Drive to "Anyone with the link can view", that file stays accessible forever unless you manually go back and change it. Most people forget to do this.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Self-Destructing Links</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Temp File links expire automatically. Whether it's 1 hour or 30 days, once the time is up, the link breaks and the data is physically deleted from our storage. No manual management required.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="space-y-6" delay={0.1}>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">Privacy Gap</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Corporate Indexing</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Google Drive scans and indexes your files for "safety" and "efficiency". While they don't sell this data directly, it's still part of their massive data profile of you.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Total Privacy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We don't scan your files. We don't care what you're sharing. Our deduplication uses hashes to prevent duplicate storage without ever knowing what the content is. Your data is yours.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Verdict box */}
        <FadeIn delay={0.2}>
          <div className="bg-muted/30 border border-border rounded-xl p-8 flex gap-6">
            <Info className="h-6 w-6 text-foreground shrink-0 mt-1" />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Verdict</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google Drive is essential for collaborative Docs and Sheets. But for <span className="text-foreground font-semibold">sending a zip of photos or a client asset</span>, Temp File is safer and more professional.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
      <CTASection />
    </div>
  );
}
