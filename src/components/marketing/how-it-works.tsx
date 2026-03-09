// src/components/marketing/how-it-works.tsx
import { FadeIn } from "@/components/ui/fade-in";
import { SectionMarker } from "@/components/ui/section-marker";

const steps = [
  {
    num: "01",
    title: "Browser hashes your file",
    desc: "SHA-256 computed locally. If the file already exists in our system, you get a share link instantly — zero upload needed.",
    code: `const hash = await crypto.subtle.digest("SHA-256", buffer)`,
  },
  {
    num: "02",
    title: "Worker issues a signed URL",
    desc: "Our Cloudflare Worker validates your plan, checks abuse scores, and returns a time-limited GCS signed upload URL.",
    code: `// Worker: metadata only. Never file bytes.
return { shareId, uploadUrl: signedGcsUrl }`,
  },
  {
    num: "03",
    title: "File goes directly to GCS",
    desc: "Your browser PUT's the file straight to Google Cloud Storage. We never see a byte. Near-zero compute, no bandwidth cost.",
    code: `PUT <SIGNED_URL>
Content-Type: application/octet-stream`,
  },
  {
    num: "04",
    title: "Auto-delete triggers",
    desc: "File expires at configured TTL. Early-delete fires if same uploader downloads once after 30min. Storage freed automatically.",
    code: `// Same IP + 1 download + >30min = schedule delete
if (earlyDeleteCondition) scheduleDelete(fileId)`,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <SectionMarker index={2} total={4} label="Architecture" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-14 space-y-3 max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight leading-[1.1] text-foreground">
              Files never touch our servers.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The upload pipeline is entirely client → GCS direct. Our
              Cloudflare Workers only handle metadata, auth, and redirects.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="border-t border-border py-8 grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-6 items-start">
                <div>
                  <span className="font-mono text-3xl font-bold text-muted-foreground/20">
                    {step.num}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="bg-muted/20 border border-border rounded-md px-4 py-3">
                  <pre className="font-mono text-[10px] text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {step.code}
                  </pre>
                </div>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
}
