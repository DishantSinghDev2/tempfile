// src/app/(marketing)/policies/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — TempFile",
  description: "TempFile privacy policy. How we handle your data.",
};

const sections = [
  {
    title: "Data We Collect",
    content: `When you upload a file anonymously, we store only the file metadata: filename, size, SHA-256 hash, MIME type, and your IP address for abuse prevention. We do not store file content — files go directly from your browser to Google Cloud Storage via a signed URL. If you create an account (optional), we store your email address, display name, and OAuth provider details for authentication purposes.`,
  },
  {
    title: "How We Use Your Data",
    content: `File metadata is used to generate share links, enforce expiry, and detect duplicate uploads via SHA-256 hashing. IP addresses are used solely for rate limiting and abuse prevention — never for tracking or advertising. Account data is used for authentication and displaying your file history.`,
  },
  {
    title: "Data Retention",
    content: `Files and their metadata are automatically deleted when they expire (24 hours for free accounts, up to 365 days for Enterprise). Early deletion occurs when specific conditions are met (see our architecture docs). Account data is retained until you delete your account. IP records are retained for 24 hours in our rate-limiting KV store.`,
  },
  {
    title: "Third-Party Services",
    content: `We use Google Cloud Storage for file storage, Cloudflare for edge delivery and database, and Paddle for payment processing. These services have their own privacy policies. We do not use advertising networks, analytics trackers, or sell your data to any third party.`,
  },
  {
    title: "Security",
    content: `All file transfers use HTTPS. Files are stored using GCS bucket-level encryption at rest. Access to files is controlled via time-limited signed URLs — no file is ever publicly accessible without a valid signed URL. Our Workers never receive your file bytes.`,
  },
  {
    title: "Your Rights",
    content: `You may request deletion of your account and all associated data by emailing privacy@tempfile.io. Anonymous uploads expire automatically. You can also delete any file immediately from your dashboard if you have an account.`,
  },
  {
    title: "Contact",
    content: `For privacy questions or requests, contact us at privacy@tempfile.io.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <div className="mb-14">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
          Legal
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mt-3 max-w-xl">
          Last updated: January 1, 2025. We keep this simple — we collect the
          minimum data needed to run the service, and we never sell it.
        </p>
      </div>

      <div className="space-y-0">
        {sections.map((section, i) => (
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
          href="/policies/terms"
          className="h-9 px-4 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
        >
          Terms of Service
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
