// src/components/marketing/features-section.tsx
import { FadeIn } from "@/components/ui/fade-in";
import { SectionMarker } from "@/components/ui/section-marker";
import {
  Fingerprint,
  Route,
  Flame,
  Timer,
  ShieldOff,
  Gauge,
} from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "SHA-256 Deduplication",
    description:
      "Client computes a hash before upload. If the file exists, you get a link instantly — no bytes transferred. Cuts storage 20–40% across the platform.",
  },
  {
    icon: Route,
    title: "Zero-proxy uploads",
    description:
      "Files go client → signed URL → GCS directly. Your browser talks straight to Google Cloud Storage. Our server only handles metadata.",
  },
  {
    icon: Flame,
    title: "Hot file CDN tier",
    description:
      "Files exceeding 3+ downloads automatically migrate to Cloudflare R2 for edge-cached serving. Huge files served fast, globally.",
  },
  {
    icon: Timer,
    title: "Smart expiry engine",
    description:
      "Files auto-delete after 24h by default. Early-delete triggers if the same IP downloads once after 30 min — clears 30–50% of storage early.",
  },
  {
    icon: ShieldOff,
    title: "Abuse protection",
    description:
      "Per-IP abuse scoring tracks upload volume, GB/day, and download bursts. Automatic blocks and CAPTCHAs prevent platform abuse.",
  },
  {
    icon: Gauge,
    title: "Near-zero compute",
    description:
      "Workers only redirect — never stream. All file data bypasses our infrastructure entirely. Runs on Cloudflare's free tier comfortably.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <SectionMarker index={1} total={4} label="How it works" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-14 space-y-3 max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight leading-[1.1] text-foreground">
              Engineered to minimize cost.
              <br />
              Maximum performance.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every design decision — from deduplication to storage tiering —
              is optimized to serve files fast while keeping infrastructure
              costs near zero.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <div className="bg-background p-6 space-y-4 h-full hover:bg-muted/10 transition-colors">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center">
                  <f.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
