// src/app/(marketing)/use-cases/page.tsx
import type { Metadata } from "next";
import { Camera, Code2, FileText, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "File Sharing Use Cases — Temp File",
  description: "Discover how professionals use Temp File for quick and secure file sharing.",
};

export default function UseCasesPage() {
  const cases = [
    {
      title: "Photographers & Videographers",
      description: "Send high-resolution raw files and video edits to clients without worrying about storage quotas. Automatic deletion ensures your work is only available for the intended review period. Deliver proofs instantly with lightning-fast CDN speeds.",
      icon: Camera,
    },
    {
      title: "Developers & IT Teams",
      description: "Quickly share log files, database dumps, and build artifacts. Use our API to integrate temporary sharing into your CI/CD pipelines. Benefit from SHA-256 deduplication to avoid redundant uploads of the same binary.",
      icon: Code2,
    },
    {
      title: "Legal & Finance Professionals",
      description: "Securely share confidential documents with password protection and at-rest encryption. Once the document is downloaded or expires, it's wiped from our infrastructure. Compliance-ready ephemeral sharing.",
      icon: FileText,
    },
    {
      title: "Remote & Hybrid Teams",
      description: "The fastest way to move files between devices and team members during calls. No folder syncing, no clutter, just a temporary link that disappears. Perfect for ad-hoc asset sharing.",
      icon: Globe,
    },
    {
      title: "Digital Agencies",
      description: "Streamline client approvals by sending assets that automatically expire after the feedback window. Professional dashboard to manage all active shares and track download statuses.",
      icon: Globe, // Use a different icon if available
    },
    {
      title: "Educational Institutions",
      description: "Share large datasets, software packages, or lecture recordings with students. Easy, account-less access for students while maintaining institutional data hygiene through auto-deletion.",
      icon: Code2, // Use a different icon if available
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Industry Use Cases
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          How world-class teams use Temp File every day.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {cases.map((c) => (
          <div key={c.title} className="space-y-4">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
              <c.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{c.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {c.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
