// src/app/(marketing)/alternatives/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Best WeTransfer Alternatives for 2026 — Temp File",
  description: "Compare the best alternatives to WeTransfer, Dropbox, and Google Drive for fast, temporary file sharing.",
};

export default function AlternativesPage() {
  const alternatives = [
    {
      name: "WeTransfer",
      description: "A popular choice for simplicity, but often criticized for slow upload speeds, intrusive advertisements, and excessive third-party tracking. Free links also expire quickly without customization.",
      better: "Temp File is 3x faster with direct GCS uploads, has zero third-party trackers, and offers custom expiry times for all users. Plus, no ads ever.",
    },
    {
      name: "Dropbox Transfer",
      description: "Part of a larger suite, making it overkill for simple shares. Requires a Dropbox account for many features and has strict bandwidth limits on free tiers.",
      better: "Temp File is built specifically for one-off transfers. No account is required, and we offer much higher free tier limits with instant link generation.",
    },
    {
      name: "Firefox Send (Legacy)",
      description: "The gold standard for private sharing, but unfortunately discontinued. Many users are looking for a spiritual successor that prioritizes privacy.",
      better: "Temp File is designed as the modern successor to Firefox Send, featuring client-side hashing, automatic deletion, and a privacy-first architecture.",
    },
    {
      name: "Google Drive",
      description: "Great for collaboration, but painful for temporary sharing. Managing permissions for 'anyone with the link' often leaves data exposed long after it's needed.",
      better: "Temp File uses auto-expiring links that physically delete the data. Once the time is up, the access is gone forever, ensuring better long-term security.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Best Alternatives for File Sharing
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Searching for a faster, more secure way to send files? See why Temp File is the preferred choice for privacy-conscious users.
        </p>
      </div>

      <div className="grid gap-8">
        {alternatives.map((alt) => (
          <div key={alt.name} className="border border-border rounded-xl p-8 hover:border-foreground/20 transition-colors">
            <h2 className="text-2xl font-semibold text-foreground mb-4">{alt.name} Alternative</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">The Issue</h3>
                <p className="text-muted-foreground">{alt.description}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <h3 className="text-sm font-mono uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Why Temp File?
                </h3>
                <p className="text-foreground text-sm leading-relaxed">{alt.better}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-foreground text-background rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to switch?</h2>
        <p className="text-background/80 mb-8 max-w-lg mx-auto">
          Join thousands of users who trust Temp File for secure, fast, and temporary file sharing.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Start Uploading
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
