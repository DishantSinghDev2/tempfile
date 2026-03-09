// src/app/(marketing)/docs/page.tsx
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionMarker } from "@/components/ui/section-marker";
import { FileCode, Shield, Zap, Terminal, ChevronRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API Documentation — Temp File",
  description: "Learn how to integrate Temp File into your application. Detailed endpoint documentation, authentication, and SDKs.",
};

const DOCS_SECTIONS = [
  {
    title: "Getting Started",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      { name: "Introduction", href: "#introduction" },
      { name: "Authentication", href: "#authentication" },
      { name: "Rate Limits", href: "#rate-limits" },
    ],
  },
  {
    title: "Core Endpoints",
    icon: <Terminal className="h-4 w-4" />,
    items: [
      { name: "POST /upload", href: "#upload" },
      { name: "GET /files/:id", href: "#get-file" },
      { name: "DELETE /files/:id", href: "#delete-file" },
    ],
  },
  {
    title: "Advanced",
    icon: <Zap className="h-4 w-4" />,
    items: [
      { name: "Webhooks", href: "#webhooks" },
      { name: "Custom Expiry", href: "#expiry" },
      { name: "Password Protection", href: "#security" },
    ],
  },
  {
    title: "Resources",
    icon: <FileCode className="h-4 w-4" />,
    items: [
      { name: "Changelog", href: "#changelog" },
      { name: "Playground", href: "/playground" },
      { name: "SDKs", href: "#sdks" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-8 h-fit sticky top-24 hidden md:block">
          {DOCS_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-mono text-[10px] uppercase tracking-widest opacity-60">
                {section.icon}
                {section.title}
              </div>
              <ul className="space-y-2 border-l border-border ml-2 pl-4">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl space-y-20 pb-20">
          {/* Header */}
          <FadeIn>
            <div className="space-y-4">
              <SectionMarker index={1} total={4} label="API Documentation" />
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                Integrate ephemeral sharing into your apps.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Temp File provides a simple, robust API for developers to upload, manage, and share files programmatically. 
                Whether you're building a CLI tool, a mobile app, or a web platform, our API is designed for speed and security.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <Link
                  href="/playground"
                  className="h-9 px-4 bg-foreground text-background text-xs font-mono rounded-md flex items-center hover:opacity-90 transition-opacity"
                >
                  API Playground
                </Link>
                <Link
                  href="https://github.com/your-repo/sdks"
                  className="h-9 px-4 border border-border text-foreground text-xs font-mono rounded-md flex items-center hover:bg-muted transition-colors"
                >
                  View SDKs
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Introduction */}
          <section id="introduction" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
            <div className="prose prose-invert prose-sm text-muted-foreground leading-relaxed">
              <p>
                The Temp File API is organized around REST. Our API has predictable resource-oriented URLs, 
                accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP 
                response codes, authentication, and verbs.
              </p>
              <div className="p-4 bg-muted/30 border border-border rounded-lg mt-4 flex items-start gap-3">
                <Clock className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Base URL:</strong> <code className="font-mono text-foreground">https://tfile.freecustom.email/api</code>
                  <br />
                  All requests should be made over HTTPS.
                </p>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" className="space-y-6 pt-12 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground">Authentication</h2>
            <div className="prose prose-invert prose-sm text-muted-foreground leading-relaxed space-y-4">
              <p>
                The Temp File API uses API keys to authenticate requests. You can view and manage your API keys 
                in the <Link href="/dashboard/settings" className="text-foreground underline underline-offset-4">Dashboard Settings</Link>.
              </p>
              <p>
                Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret 
                API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
              </p>
              <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-white/10">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span>Example Header</span>
                </div>
                <code className="text-emerald-400">Authorization: Bearer tf_sk_...</code>
              </div>
            </div>
          </section>

          {/* Upload Endpoint */}
          <section id="upload" className="space-y-6 pt-12 border-t border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">POST /upload</h2>
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20">POST</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Request a signed URL to upload a file directly to our CDN. This approach ensures maximum speed and minimal latency.
            </p>

            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-foreground">Body Parameters</h4>
              <div className="space-y-4">
                {[
                  { name: "filename", type: "string", required: true, desc: "The original name of the file." },
                  { name: "mimeType", type: "string", required: true, desc: "The MIME type of the file (e.g. image/png)." },
                  { name: "size", type: "number", required: true, desc: "Size of the file in bytes." },
                  { name: "sha256", type: "string", required: true, desc: "SHA-256 hash of the file for deduplication." },
                  { name: "expiryHours", type: "number", required: false, desc: "Custom expiry time (1-720 hours)." },
                ].map((param) => (
                  <div key={param.name} className="flex gap-4 items-start py-3 border-b border-border last:border-0">
                    <div className="w-32 shrink-0">
                      <code className="text-xs font-mono text-foreground">{param.name}</code>
                      <p className="text-[10px] text-zinc-500 mt-1">{param.type}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{param.desc}</p>
                      {param.required && <span className="text-[9px] text-amber-500 font-mono mt-1 block uppercase">Required</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 rounded-lg p-4 font-mono text-[11px] border border-white/10">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span>Request Example (cURL)</span>
              </div>
              <pre className="text-zinc-300">
                {`curl -X POST https://tfile.freecustom.email/api/upload \\
  -H "Authorization: Bearer tf_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "filename": "backup.zip",
    "size": 102456,
    "sha256": "e3b0c442...",
    "mimeType": "application/zip"
  }'`}
              </pre>
            </div>
          </section>

          {/* Changelog */}
          <section id="changelog" className="space-y-6 pt-12 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground">Changelog</h2>
            <div className="space-y-8">
              <div className="relative pl-8 border-l border-border space-y-2">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-foreground" />
                <span className="text-[10px] font-mono text-zinc-500">March 2026 — v1.1.0</span>
                <h4 className="text-sm font-semibold text-foreground">Added SHA-256 Deduplication</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Improved upload speeds for existing files by checking hashes before initiating storage transfers.
                </p>
              </div>
              <div className="relative pl-8 border-l border-border space-y-2">
                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border" />
                <span className="text-[10px] font-mono text-zinc-500">February 2026 — v1.0.0</span>
                <h4 className="text-sm font-semibold text-foreground">Initial API Release</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Core upload and download endpoints released to production.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
