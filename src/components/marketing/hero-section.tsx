// src/components/marketing/hero-section.tsx
"use client";

import { motion } from "framer-motion";
import { UploadZone } from "@/components/upload/upload-zone";
import { Shield, Zap, Globe } from "lucide-react";

const decorativeFragments = [
  { text: "SHA-256", x: "8%", y: "15%" },
  { text: "TTL=86400", x: "85%", y: "20%" },
  { text: "PUT /upload", x: "5%", y: "65%" },
  { text: "302 redirect", x: "88%", y: "55%" },
  { text: "Content-Type", x: "12%", y: "85%" },
  { text: "CF-Ray:", x: "80%", y: "80%" },
  { text: "X-Dedup: true", x: "50%", y: "8%" },
];

const stats = [
  { value: "100MB", label: "Free file limit" },
  { value: "< 50ms", label: "Signed URL latency" },
  { value: "0", label: "Bytes proxied" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center py-24 px-6 overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(0 0% 50% / 0.11) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Decorative vertical borders */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-border/60"
        style={{ left: "max(0px, calc(50% - 40rem))" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-border/60"
        style={{ right: "max(0px, calc(50% - 40rem))" }}
      />

      {/* Decorative code fragments */}
      {decorativeFragments.map((f) => (
        <span
          key={f.text}
          aria-hidden
          className="pointer-events-none select-none absolute font-mono text-[10px] text-foreground"
          style={{ left: f.x, top: f.y, opacity: 0.035 }}
        >
          {f.text}
        </span>
      ))}

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-2 py-1 text-muted-foreground">
            Free · No login · Auto-expiring
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-foreground">
            Share files.
            <br />
            They disappear.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Drop a file, get a link. Auto-deletes in 24 hours. Direct upload to
            Google Cloud — our server never sees your bytes. SHA-256
            deduplication for instant re-uploads.
          </p>
        </motion.div>

        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <UploadZone maxSizeMb={100} expiryHours={24} />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-background px-4 py-5 flex flex-col items-center gap-1"
              >
                <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
                  {s.value}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <div className="flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5 bg-background">
            <Shield className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground">
              End-to-end signed URLs
            </span>
          </div>
          <div className="flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5 bg-background">
            <Zap className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground">
              GCS + Cloudflare R2
            </span>
          </div>
          <div className="flex items-center gap-1.5 border border-border rounded-md px-2.5 py-1.5 bg-background">
            <Globe className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground">
              200+ edge locations
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
