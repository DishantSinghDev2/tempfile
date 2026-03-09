// src/app/(marketing)/comparison/page.tsx
import type { Metadata } from "next";
import { Check, X, Shield, Zap, Globe, Lock } from "lucide-react";
import { SectionMarker } from "@/components/ui/section-marker";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "In-Depth Comparison — Temp File vs Others",
  description: "A detailed breakdown of how Temp File compares to WeTransfer, Dropbox, Google Drive and others in speed, security, and privacy.",
};

const COMPARISON_DATA = [
  {
    feature: "Max File Size (Free)",
    tempfile: "100 MB",
    wetransfer: "2 GB",
    dropbox: "2 GB",
    gdrive: "15 GB",
    highlight: true,
  },
  {
    feature: "Zero-Knowledge Encryption",
    tempfile: true,
    wetransfer: false,
    dropbox: false,
    gdrive: false,
  },
  {
    feature: "Auto-Expiry Links",
    tempfile: "Custom (1h - 30d)",
    wetransfer: "7 days (Fixed)",
    dropbox: "Manual deletion",
    gdrive: "Manual removal",
  },
  {
    feature: "Deduplication (SHA-256)",
    tempfile: true,
    wetransfer: false,
    dropbox: false,
    gdrive: false,
  },
  {
    feature: "Direct CDN Uploads",
    tempfile: true,
    wetransfer: false,
    dropbox: false,
    gdrive: false,
  },
  {
    feature: "No Account Required",
    tempfile: true,
    wetransfer: true,
    dropbox: false,
    gdrive: false,
  },
  {
    feature: "Privacy Focused (No Ads)",
    tempfile: true,
    wetransfer: false,
    dropbox: true,
    gdrive: true,
  }
];

export default function ComparisonPage() {
  return (
    <div className="py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-24">
        {/* Hero */}
        <FadeIn>
          <div className="space-y-4 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Comparison
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Built for privacy.
              <br />
              Optimized for speed.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Most file sharing services focus on storage and collaboration. 
              Temp File is built for the one thing that matters: 
              <span className="text-foreground"> moving data from A to B securely and efficiently.</span>
            </p>
          </div>
        </FadeIn>

        {/* Comparison Grid */}
        <FadeIn delay={0.1}>
          <div className="space-y-8">
            <SectionMarker index={1} total={3} label="The Breakdown" />
            <div className="rounded-lg border border-border overflow-hidden overflow-x-auto bg-background">
              <table className="min-w-[800px] w-full text-sm">
                <thead>
                  <tr className="bg-muted/20 border-b border-border text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    <th className="text-left px-6 py-4">Feature</th>
                    <th className="text-center px-6 py-4 text-foreground bg-muted/10">Temp File</th>
                    <th className="text-center px-6 py-4">WeTransfer</th>
                    <th className="text-center px-6 py-4">Dropbox</th>
                    <th className="text-center px-6 py-4">G Drive</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_DATA.map((row, i) => (
                    <tr key={row.feature} className="border-b border-border last:border-0 hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center bg-muted/5">
                        {typeof row.tempfile === "boolean" ? (
                          row.tempfile ? <Check className="h-4 w-4 text-foreground mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="font-mono text-xs font-semibold text-foreground">{row.tempfile}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.wetransfer === "boolean" ? (
                          row.wetransfer ? <Check className="h-4 w-4 text-muted-foreground mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">{row.wetransfer}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.dropbox === "boolean" ? (
                          row.dropbox ? <Check className="h-4 w-4 text-muted-foreground mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">{row.dropbox}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.gdrive === "boolean" ? (
                          row.gdrive ? <Check className="h-4 w-4 text-muted-foreground mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">{row.gdrive}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Why us sections */}
        <div className="grid md:grid-cols-3 gap-12">
           <FadeIn delay={0.2} className="space-y-4">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Speed First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use direct-to-cloud uploads and global CDNs. Your files don't proxy through our servers, meaning you get the full speed of your connection.
              </p>
           </FadeIn>
           <FadeIn delay={0.25} className="space-y-4">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Privacy by Design</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Everything is ephemeral. We don't track your downloads, we don't sell your data, and we don't keep logs of what you share.
              </p>
           </FadeIn>
           <FadeIn delay={0.3} className="space-y-4">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Optional password protection, download limits, and custom expiry times give you full control over who sees your data and for how long.
              </p>
           </FadeIn>
        </div>

        {/* Detailed deep dives */}
        <div className="space-y-16">
          <SectionMarker index={2} total={3} label="Deep Dives" />
          
          <div className="grid md:grid-cols-2 gap-16">
            <FadeIn className="space-y-4">
              <h3 className="text-xl font-semibold">Vs. WeTransfer</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                WeTransfer is the industry standard for ease of use, but it comes at a cost. Their free tier is subsidized by intrusive full-page ads and tracking. Temp File offers a cleaner, ad-free experience with better control over link expiration and security.
              </p>
              <Link href="/alternatives/wetransfer" className="text-xs font-mono uppercase tracking-widest border-b border-foreground/20 pb-1 hover:border-foreground transition-colors">
                Read full comparison →
              </Link>
            </FadeIn>

            <FadeIn className="space-y-4">
              <h3 className="text-xl font-semibold">Vs. Firefox Send</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Firefox Send was beloved for its privacy. Since its demise, many have looked for a replacement. Temp File was built with the same spirit: simple, secure, and dedicated to the philosophy that some files aren't meant to live on the cloud forever.
              </p>
              <Link href="/alternatives/firefox-send" className="text-xs font-mono uppercase tracking-widest border-b border-foreground/20 pb-1 hover:border-foreground transition-colors">
                Read full comparison →
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
      <CTASection />
    </div>
  );
}
