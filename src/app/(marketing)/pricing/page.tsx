// src/app/(marketing)/pricing/page.tsx
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { SectionMarker } from "@/components/ui/section-marker";
import { FadeIn } from "@/components/ui/fade-in";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";
import { ShieldCheck, Lock, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Temp File",
  description:
    "Simple, transparent pricing for individuals, developers, and enterprises. Start free, upgrade when you need more. Powered by Paddle.",
  alternates: { canonical: "https://tempfile.io/pricing" },
};

export default function PricingPage() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <FadeIn>
          <div className="space-y-4 max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Pricing
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Simple pricing.
              <br />
              No surprises.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              All plans include SHA-256 deduplication, direct GCS uploads, and
              Cloudflare CDN. Pay only for what you need.
            </p>
          </div>
        </FadeIn>

        {/* Pricing grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
            {PLANS.map((plan, i) => (
              <div
                key={plan.id}
                className={`bg-background p-6 flex flex-col gap-6 ${i === 2 ? "relative" : ""}`}
              >
                {i === 2 && (
                  <div className="absolute top-0 inset-x-0 h-px bg-foreground/20" />
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">
                      {plan.name}
                    </span>
                    {i === 2 && (
                      <span className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
                      ${plan.priceMonthly}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      /mo
                    </span>
                  </div>
                  {plan.priceYearly > 0 && (
                    <p className="font-mono text-[10px] text-muted-foreground">
                      ${plan.priceYearly}/yr — save{" "}
                      {Math.round(
                        (1 - plan.priceYearly / (plan.priceMonthly * 12)) * 100
                      )}
                      %
                    </p>
                  )}
                </div>

                {/* Plan specs */}
                <div className="space-y-2">
                  {[
                    `${plan.maxFileSizeMb >= 1024 ? plan.maxFileSizeMb / 1024 + " GB" : plan.maxFileSizeMb + " MB"} per file`,
                    `${plan.maxStorageGb} GB storage`,
                    `${plan.maxExpiryDays}d max expiry`,
                    plan.maxDownloads ? `${plan.maxDownloads} downloads/file` : "Unlimited downloads",
                    plan.creditsMonthly > 0
                      ? `${plan.creditsMonthly} credits/mo`
                      : "No credits",
                  ].map((spec) => (
                    <div key={spec} className="border-t border-border py-2.5 flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" strokeWidth={2.5} />
                      <span className="text-xs text-muted-foreground">{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {plan.priceMonthly === 0 ? (
                    <Link
                      href="/"
                      className="w-full h-9 flex items-center justify-center text-xs font-mono border border-border text-foreground rounded-md hover:bg-muted transition-colors"
                    >
                      Start free
                    </Link>
                  ) : (
                    <Link
                      href={`/checkout?plan=${plan.id}`}
                      className={`w-full h-9 flex items-center justify-center text-xs font-mono rounded-md transition-opacity hover:opacity-90 ${
                        i === 2
                          ? "bg-foreground text-background"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      Get {plan.name}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Payment trust strip */}
        <FadeIn delay={0.15}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-border rounded-md px-3 py-1.5 bg-background flex items-center gap-2">
              <Lock className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">
                Secure checkout via Paddle
              </span>
            </div>
            {[SiVisa, SiMastercard, SiPaypal].map((Icon, i) => (
              <div
                key={i}
                className="border border-border rounded bg-muted/20 px-2 py-1.5 text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
              </div>
            ))}
            <div className="border border-border rounded-md px-2.5 py-1.5 flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">
                200+ countries
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Feature comparison table */}
        <FadeIn delay={0.2}>
          <div className="space-y-6">
            <SectionMarker index={1} total={2} label="Compare plans" />
            <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      Feature
                    </th>
                    {PLANS.map((p) => (
                      <th
                        key={p.id}
                        className="px-4 py-3 text-center border-l border-border font-mono text-xs uppercase tracking-widest text-foreground"
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Max file size",
                      values: PLANS.map((p) =>
                        p.maxFileSizeMb >= 1024
                          ? `${p.maxFileSizeMb / 1024} GB`
                          : `${p.maxFileSizeMb} MB`
                      ),
                    },
                    {
                      label: "Max expiry",
                      values: PLANS.map((p) => `${p.maxExpiryDays}d`),
                    },
                    {
                      label: "Downloads per file",
                      values: PLANS.map((p) =>
                        p.maxDownloads ? String(p.maxDownloads) : "∞"
                      ),
                    },
                    {
                      label: "File history",
                      values: [false, true, true, true],
                    },
                    {
                      label: "Password protection",
                      values: [false, false, true, true],
                    },
                    {
                      label: "Custom forms",
                      values: [false, false, true, true],
                    },
                    {
                      label: "Donate buttons",
                      values: [false, true, true, true],
                    },
                    {
                      label: "Custom styling",
                      values: [false, false, true, true],
                    },
                    {
                      label: "API access",
                      values: [false, false, true, true],
                    },
                    {
                      label: "Custom domain",
                      values: [false, false, false, true],
                    },
                    {
                      label: "SLA guarantee",
                      values: [false, false, false, true],
                    },
                  ].map((row, ri) => (
                    <tr
                      key={row.label}
                      className={`border-t border-border hover:bg-muted/10 transition-colors ${ri % 2 === 0 ? "" : "bg-muted/5"}`}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {row.label}
                      </td>
                      {row.values.map((val, vi) => (
                        <td
                          key={vi}
                          className="px-4 py-3 text-center border-l border-border"
                        >
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="h-3.5 w-3.5 text-foreground mx-auto" />
                            ) : (
                              <span className="h-3.5 w-3.5 rounded-full border border-border block mx-auto" />
                            )
                          ) : (
                            <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Money-back guarantee */}
        <FadeIn delay={0.25}>
          <div className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 bg-background w-fit">
            <ShieldCheck className="h-5 w-5 text-foreground/70 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">
                7-day money-back guarantee
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Not satisfied? Full refund within 7 days.{" "}
                <Link
                  href="/policies/refund"
                  className="underline underline-offset-4 decoration-border hover:text-foreground transition-colors"
                >
                  Refund policy →
                </Link>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
