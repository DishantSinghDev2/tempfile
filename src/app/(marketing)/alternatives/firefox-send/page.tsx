// src/app/(marketing)/alternatives/firefox-send/page.tsx
import type { Metadata } from "next";
import { Check, X, Shield, Info, Heart } from "lucide-react";
import { SectionMarker } from "@/components/ui/section-marker";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "The Best Firefox Send Successor — Temp File",
  description: "Firefox Send is gone. See why Temp File is the best spiritual successor for private, simple file sharing.",
};

export default function FirefoxSendComparison() {
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
              A Worthy Successor to Firefox Send
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              When Mozilla shut down Firefox Send, millions lost their favorite privacy tool. We've built Temp File to carry that torch.
            </p>
          </div>
        </FadeIn>

        {/* Detailed Points */}
        <div className="grid md:grid-cols-2 gap-16">
          <FadeIn className="space-y-6">
             <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">Built for the Same Audience</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Simplicity Reimagined</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Firefox Send was loved for its no-nonsense, drag-and-drop interface. It didn't try to be a cloud drive—it was just a bridge.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">The Same Philosophy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Temp File shares that DNA. Our homepage is a single upload zone. No distraction, no unnecessary steps. Just your file and its destination.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="space-y-6" delay={0.1}>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-foreground" />
              <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">Modern Security</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Privacy First</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Like Firefox Send, we use automatic deletion. Once your file expires or reaches its download limit, it's purged from existence.
                </p>
              </div>
              <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg">
                <h4 className="text-sm font-semibold mb-1">Better Infrastructure</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We've improved on the original concept by using direct CDN uploads and SHA-256 deduplication, ensuring that even as a privacy tool, it's also a high-performance one.
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
                If you miss Firefox Send, <span className="text-foreground font-semibold">you'll feel right at home here.</span> We've kept the soul of simple, private sharing alive and well.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
      <CTASection />
    </div>
  );
}
