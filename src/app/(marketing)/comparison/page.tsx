// src/app/(marketing)/comparison/page.tsx
import type { Metadata } from "next";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Temp File vs Competitors — Feature Comparison",
  description: "Detailed comparison of Temp File vs WeTransfer, Firefox Send, and Dropbox Transfer.",
};

export default function ComparisonPage() {
  const features = [
    { name: "Max File Size", tf: "10 GB+", wt: "2 GB", fs: "2.5 GB", db: "100 MB" },
    { name: "Auto-Deletion", tf: true, wt: true, fs: true, db: true },
    { name: "Zero Trackers", tf: true, wt: false, fs: true, db: false },
    { name: "No Account Req.", tf: true, wt: true, fs: false, db: true },
    { name: "Direct Upload (CDN)", tf: true, wt: false, fs: false, db: false },
    { name: "SHA-256 Deduplication", tf: true, wt: false, fs: false, db: false },
    { name: "Encrypted Storage", tf: true, wt: "Optional", fs: true, db: true },
    { name: "Custom Expiry", tf: true, wt: "Paid", fs: true, db: "Paid" },
    { name: "Password Protect", tf: true, wt: "Paid", fs: true, db: "Paid" },
    { name: "API Access", tf: "REST SDK", wt: "Limited", fs: "None", db: "Paid" },
    { name: "Bot Protection", tf: "Turnstile", wt: "Hidden", fs: "None", db: "Recaptcha" },
  ];

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Feature Comparison
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          See how Temp File stacks up against the competition.
        </p>
      </div>

      <div className="overflow-x-auto border border-border rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs uppercase font-mono tracking-widest text-muted-foreground">
              <th className="p-6">Feature</th>
              <th className="p-6 text-foreground font-bold">Temp File</th>
              <th className="p-6">WeTransfer</th>
              <th className="p-6">FF Send</th>
              <th className="p-6">Dropbox</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {features.map((f) => (
              <tr key={f.name} className="hover:bg-muted/30 transition-colors">
                <td className="p-6 text-sm font-medium text-foreground">{f.name}</td>
                <td className="p-6 text-sm text-foreground">
                  {typeof f.tf === "boolean" ? (
                    f.tf ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />
                  ) : f.tf}
                </td>
                <td className="p-6 text-sm text-muted-foreground">
                  {typeof f.wt === "boolean" ? (
                    f.wt ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />
                  ) : f.wt}
                </td>
                <td className="p-6 text-sm text-muted-foreground">
                  {typeof f.fs === "boolean" ? (
                    f.fs ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />
                  ) : f.fs}
                </td>
                <td className="p-6 text-sm text-muted-foreground">
                  {typeof f.db === "boolean" ? (
                    f.db ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />
                  ) : f.db}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
