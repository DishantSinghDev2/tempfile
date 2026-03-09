// src/app/(marketing)/policies/refund/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy — Temp File",
  description: "Temp File 7-day money-back guarantee and refund policy.",
};

export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <div className="mb-14">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Legal
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Refund Policy
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mt-3 max-w-xl">
          We stand behind Temp File. If it doesn't work for you, we'll refund
          you — no awkward questions.
        </p>
      </div>

      <div className="rounded-lg bg-muted/20 border border-border px-5 py-4 mb-12">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-foreground/70 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              7-day money-back guarantee
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Request a full refund within 7 days of your first subscription
              payment. No conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-0">
        {[
          {
            title: "Eligibility",
            content: "Any paid subscription (Starter, Pro, Enterprise) is eligible for a full refund if requested within 7 calendar days of the initial subscription payment. This applies to the first payment of a new subscription only.",
          },
          {
            title: "How to Request",
            content: "Email refunds@tempfile.io with your account email and Paddle transaction ID. We'll process the refund within 2 business days. You'll receive a confirmation email once processed.",
          },
          {
            title: "Processing Time",
            content: "Refunds are processed through Paddle and typically appear on your statement within 5–10 business days, depending on your payment method and bank.",
          },
          {
            title: "After a Refund",
            content: "Your account will revert to the Free plan immediately upon refund. Any files you uploaded while on a paid plan will remain accessible until their expiry date, after which they will be deleted normally.",
          },
          {
            title: "Credits",
            content: "Credits purchased a-la-carte (not as part of a monthly subscription) are non-refundable once used. Unused credits may be refunded within 7 days of purchase.",
          },
        ].map((section, i) => (
          <div key={section.title} className="border-t border-border py-8">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-5">
              {String(i + 1).padStart(2, "0")} — {section.title.toUpperCase()}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
        <div className="border-t border-border" />
      </div>

      <div className="flex gap-3 mt-12">
        <Link
          href="/pricing"
          className="h-9 px-4 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
        >
          View pricing
        </Link>
        <a
          href="mailto:refunds@tempfile.io"
          className="h-9 px-4 text-xs font-mono border border-border text-foreground rounded-md flex items-center hover:bg-muted transition-colors"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}
