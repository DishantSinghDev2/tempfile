// src/components/marketing/cta-section.tsx
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionMarker } from "@/components/ui/section-marker";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <SectionMarker index={4} total={4} label="Get started" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight leading-[1.1] text-foreground">
                Ready to share?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Drop a file on this page and get a link in seconds. No account,
                no email, no tracking. Upgrade to Pro for larger files, longer
                expiry, and API access.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="h-11 px-6 text-base bg-foreground text-background rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                Upload a file
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="h-11 px-6 text-base border border-border text-foreground rounded-md flex items-center hover:bg-muted transition-colors"
              >
                View pricing
              </Link>
            </div>

            {/* FAQ */}
            <div className="pt-6">
              <SectionMarker index={3} total={4} label="FAQ" />
              <div className="space-y-0">
                {[
                  {
                    q: "Is there a file size limit for free users?",
                    a: "Free users can upload up to 100 MB per file. Files auto-delete after 24 hours. No account required.",
                  },
                  {
                    q: "How does instant upload work?",
                    a: "Your browser computes a SHA-256 hash before uploading. If an identical file already exists on our platform, you receive a share link immediately — no data is transferred.",
                  },
                  {
                    q: "Can anyone access my file?",
                    a: "Files are accessible via a randomly generated 12-character ID. There are no public listings. You control who you share the link with.",
                  },
                  {
                    q: "Is there an API for developers?",
                    a: "Yes. Pro and Enterprise plans include full REST API access with signed upload URLs, webhook support, and programmatic file management.",
                  },
                  {
                    q: "What happens to files after expiry?",
                    a: "Expired files are deleted from both GCS and R2. The share ID becomes invalid. We do not retain file data after deletion.",
                  },
                ].map((item) => (
                  <details key={item.q} className="group border-t border-border py-5 last:border-b">
                    <summary className="list-none flex justify-between gap-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden cursor-pointer">
                      {item.q}
                      <span className="shrink-0 text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-lg leading-none">
                        +
                      </span>
                    </summary>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3 pr-8">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
