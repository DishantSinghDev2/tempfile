// src/app/(marketing)/alternatives/dropbox/page.tsx
import type { Metadata } from "next";
import { Check, X, Shield, Info, Archive } from "lucide-react";
import { SectionMarker } from "@/components/ui/section-marker";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Temp File vs Dropbox Transfer — Lightweight vs Suite",
  description: "Why Temp File is the better alternative to Dropbox for one-off temporary file shares.",
};

export default function DropboxComparison() {
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
              Temp File vs Dropbox Transfer
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Dropbox is built for storage and long-term sync. Using it for temporary transfers is overkill and often slow.
            </p>
          </div>
        </FadeIn>

        {/* Comparison section */}
        <div className="grid md:grid-cols-2 gap-16">
          <FadeIn className="space-y-6">
             <div className="flex items-center gap-3">
              <Archive className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">Storage vs Sharing</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Dropbox's Storage Trap</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dropbox Transfer is an add-on to their core storage service. Using it often requires you to move files into your Dropbox storage first, counting against your quota.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Temp File's Pure Sharing</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Temp File is built for ephemeral data. Upload a file, get a link, and it's gone after it expires. It doesn't clutter your permanent storage, and there's no complex syncing involved.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="space-y-6" delay={0.1}>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">User Friction</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Account Walls</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Managing transfers in Dropbox often requires you to be logged in. Recipients are sometimes prompted to sign up to view or download larger files, creating friction.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Zero-Friction Sharing</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No account is ever required to upload (up to 100 MB) or download from Temp File. It's a frictionless link that works in any browser, anywhere.
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
                If you already pay for Dropbox and need to sync files across multiple devices, stick with it. But for sending a file to a client or friend <span className="text-foreground font-semibold">quickly and anonymously</span>, Temp File is the clear winner.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
      <CTASection />
    </div>
  );
}
