// src/app/(marketing)/alternatives/wetransfer/page.tsx
import type { Metadata } from "next";
import { Check, X, Shield, Zap, Info } from "lucide-react";
import { SectionMarker } from "@/components/ui/section-marker";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Temp File vs WeTransfer — The Better Alternative",
  description: "Detailed comparison between Temp File and WeTransfer. See why Temp File is faster, more secure, and ad-free.",
};

export default function WeTransferComparison() {
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
              Temp File vs WeTransfer
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              WeTransfer is the household name for file sharing. But for power users and privacy-conscious professionals, its shortcomings are clear. 
            </p>
          </div>
        </FadeIn>

        {/* Detailed Points */}
        <div className="grid md:grid-cols-2 gap-16">
          <FadeIn className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">The WeTransfer Bottleneck</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  WeTransfer's upload speeds are often inconsistent. Because they handle massive traffic across a centralized infrastructure, speeds can fluctuate wildly during peak hours.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">The Temp File Advantage</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use direct-to-GCS signed URLs. This means your file goes directly from your browser to Google's massive global network, bypassing our servers entirely. The result? Max speeds on every upload.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="space-y-6" delay={0.1}>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">Privacy & Security</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Ad-Supported Business Model</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  WeTransfer's free tier is ad-supported. These full-page background ads aren't just annoying—they often load trackers that follow you across the web.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Ephemeral & Ad-Free</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Temp File has zero third-party ads. We don't track who downloads your files, and we don't sell data to advertisers. Our business model is simple: pay for premium features, or use the free tier for simple shares.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Feature Comparison Table */}
        <FadeIn delay={0.2}>
          <div className="space-y-8">
            <SectionMarker index={1} total={2} label="Side-by-side" />
            <div className="rounded-lg border border-border overflow-hidden bg-background">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/20 border-b border-border text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    <th className="text-left px-6 py-4">Feature</th>
                    <th className="text-center px-6 py-4">WeTransfer</th>
                    <th className="text-center px-6 py-4 text-foreground bg-muted/10">Temp File</th>
                  </tr>
                </thead>
                <tbody>
                   {[
                     { label: "Free Tier Size", wetransfer: "2 GB", tempfile: "100 MB" },
                     { label: "Ad-Free Experience", wetransfer: false, tempfile: true },
                     { label: "Custom Expiry (Free)", wetransfer: false, tempfile: true },
                     { label: "Direct CDN Uploads", wetransfer: false, tempfile: true },
                     { label: "Privacy First", wetransfer: false, tempfile: true },
                     { label: "Password Protection", wetransfer: "Paid only", tempfile: "Paid only" },
                   ].map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{row.label}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.wetransfer === "boolean" ? (
                          row.wetransfer ? <Check className="h-4 w-4 text-muted-foreground mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">{row.wetransfer}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-muted/5 font-mono text-xs font-semibold text-foreground">
                        {typeof row.tempfile === "boolean" ? (
                          row.tempfile ? <Check className="h-4 w-4 text-foreground mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        ) : (
                          row.tempfile
                        )}
                      </td>
                    </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Closing info */}
        <FadeIn delay={0.3}>
          <div className="bg-muted/30 border border-border rounded-xl p-8 flex gap-6">
            <Info className="h-6 w-6 text-foreground shrink-0 mt-1" />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Verdict</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you need to send a massive 2 GB file and don't care about ads, tracking, or speed, WeTransfer is fine. But if you value speed, privacy, and control, <span className="text-foreground font-semibold">Temp File is the superior tool for everyday transfers.</span>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
      <CTASection />
    </div>
  );
}
