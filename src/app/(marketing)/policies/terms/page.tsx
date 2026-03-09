// src/app/(marketing)/policies/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — TempFile",
  description: "TempFile Terms of Service. Rules for using the platform.",
  alternates: { canonical: "https://tempfile.io/policies/terms" },
};

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using TempFile (the 'Service'), you agree to be bound by these Terms. If you do not agree, do not use the Service. We may update these Terms at any time; continued use after changes constitutes acceptance.",
  },
  {
    title: "Permitted Use",
    content:
      "You may use TempFile to upload, share, and transfer files for lawful purposes only. You are solely responsible for the content you upload. You must not use the Service for any illegal purpose, including distributing copyrighted material without permission, sharing malware or malicious code, uploading content that sexually exploits minors, or any activity that violates applicable law.",
  },
  {
    title: "Prohibited Content",
    content:
      "The following file types and content are strictly prohibited: malware, ransomware, or any executable code designed to harm systems; child sexual abuse material (CSAM); content facilitating illegal activities; spam or phishing material; content that infringes third-party intellectual property rights. We reserve the right to delete any file and terminate any account that violates these prohibitions without prior notice.",
  },
  {
    title: "Service Availability",
    content:
      "TempFile is provided on an 'as-is' basis. We do not guarantee 100% uptime. Files are ephemeral by design — they will be deleted at expiry. Do not use TempFile as your only copy of important files. We are not liable for data loss resulting from scheduled or unscheduled deletions.",
  },
  {
    title: "Subscriptions and Billing",
    content:
      "Paid plans are billed through Paddle. By subscribing, you authorize recurring charges at your chosen billing interval. You may cancel at any time; cancellation takes effect at the end of the current billing period. Refunds are governed by our Refund Policy.",
  },
  {
    title: "API and Developer Use",
    content:
      "The TempFile API is available to Pro and Enterprise subscribers. You must not use the API to circumvent platform limits, build competing services using our infrastructure, or violate these Terms. We may rate-limit or revoke API access at our discretion.",
  },
  {
    title: "Limitation of Liability",
    content:
      "To the maximum extent permitted by law, TempFile and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.",
  },
  {
    title: "Governing Law",
    content:
      "These Terms are governed by and construed in accordance with applicable law. Any disputes shall be resolved through binding arbitration, except where prohibited by law.",
  },
  {
    title: "Contact",
    content: "For legal inquiries, contact legal@tempfile.io.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <div className="mb-14">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Legal
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mt-3 max-w-xl">
          Last updated: January 1, 2025. Please read these Terms carefully
          before using TempFile.
        </p>
      </div>

      <div className="space-y-0">
        {sections.map((section, i) => (
          <div key={section.title} className="border-t border-border py-8">
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-5">
              {String(i + 1).padStart(2, "0")} —{" "}
              {section.title.toUpperCase()}
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
          href="/policies/privacy"
          className="h-9 px-4 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
        >
          Privacy Policy
        </Link>
        <Link
          href="/policies/refund"
          className="h-9 px-4 text-xs font-mono border border-border text-foreground rounded-md flex items-center hover:bg-muted transition-colors"
        >
          Refund Policy
        </Link>
      </div>
    </div>
  );
}
