// src/app/(marketing)/docs/page.tsx
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionMarker } from "@/components/ui/section-marker";

export const metadata: Metadata = {
  title: "API Docs — TempFile",
  description:
    "TempFile REST API reference. Upload, manage, and share files programmatically. Direct GCS signed URLs, deduplication, and webhook events.",
  alternates: { canonical: "https://tempfile.io/docs" },
};

const endpoints = [
  {
    method: "POST",
    path: "/api/upload",
    auth: "Optional",
    description: "Request a signed upload URL or detect a dedup hit.",
    request: `{
  "filename": "report.pdf",
  "mimeType": "application/pdf",
  "size": 2048000,
  "sha256": "abc123...",       // SHA-256 hex, computed client-side
  "expiryHours": 24,           // 1–8760 (plan-limited)
  "maxDownloads": null         // null = unlimited
}`,
    response: `// New file:
{
  "success": true,
  "data": {
    "shareId": "abc12345xyz0",
    "uploadUrl": "https://storage.googleapis.com/...",
    "alreadyExists": false,
    "expiresAt": "2025-01-02T00:00:00Z"
  }
}

// Instant dedup hit (no upload needed):
{
  "success": true,
  "data": {
    "shareId": "def67890uvw1",
    "alreadyExists": true,
    "expiresAt": "2025-01-02T00:00:00Z"
  }
}`,
  },
  {
    method: "POST",
    path: "/api/upload/confirm",
    auth: "Optional",
    description: "Mark a file as active after successful GCS upload.",
    request: `{ "shareId": "abc12345xyz0" }`,
    response: `{ "success": true }`,
  },
  {
    method: "POST",
    path: "/api/dedup",
    auth: "None",
    description: "Pre-check if a file hash already exists before uploading.",
    request: `{ "sha256": "abc123..." }`,
    response: `{
  "success": true,
  "data": {
    "exists": true,
    "shareId": "abc12345xyz0"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/files/:shareId",
    auth: "None",
    description: "Get metadata for a shared file.",
    request: `// URL param: shareId`,
    response: `{
  "success": true,
  "data": {
    "id": "abc12345xyz0",
    "filename": "report.pdf",
    "size": 2048000,
    "mimeType": "application/pdf",
    "expiresAt": "2025-01-02T00:00:00Z",
    "downloadCount": 3,
    "maxDownloads": null,
    "isExpired": false,
    "requiresPassword": false
  }
}`,
  },
  {
    method: "GET",
    path: "/api/files/:shareId/download",
    auth: "None",
    description: "Redirect (302) to a signed download URL. Never proxies bytes.",
    request: `// URL param: shareId`,
    response: `302 Location: https://storage.googleapis.com/... (or R2 URL)`,
  },
  {
    method: "GET",
    path: "/api/files",
    auth: "Required (Pro+)",
    description: "List your files with pagination.",
    request: `// Query: ?page=1&limit=20`,
    response: `{
  "success": true,
  "data": [/* File records */]
}`,
  },
  {
    method: "DELETE",
    path: "/api/files",
    auth: "Required",
    description: "Delete a file by ID.",
    request: `// Query: ?id={fileId}`,
    response: `{ "success": true }`,
  },
];

export default function DocsPage() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        <FadeIn>
          <div className="space-y-4 max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Docs
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              API Reference
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              TempFile exposes a simple REST API. Files are never proxied
              through the API — all data flows directly between your client and
              GCS/R2 via signed URLs.
            </p>
          </div>
        </FadeIn>

        {/* Base URL */}
        <FadeIn delay={0.05}>
          <div className="rounded-lg bg-muted/20 border border-border px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Base URL
            </p>
            <code className="font-mono text-sm text-foreground">
              https://tempfile.io
            </code>
          </div>
        </FadeIn>

        {/* Upload flow */}
        <FadeIn delay={0.1}>
          <SectionMarker index={1} total={3} label="Upload Flow" />
          <div className="space-y-4 max-w-xl">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The upload flow has three steps: compute SHA-256 client-side,
              request a signed URL (or get a dedup hit), then PUT the file
              directly to GCS.
            </p>
            <div className="bg-muted/20 border border-border rounded-lg p-5">
              <pre className="font-mono text-xs text-foreground leading-relaxed overflow-x-auto">{`// 1. Compute hash client-side (Web Crypto API)
const hash = await crypto.subtle.digest("SHA-256", fileBuffer);
const sha256 = Array.from(new Uint8Array(hash))
  .map(b => b.toString(16).padStart(2, "0")).join("");

// 2. Request upload URL
const res = await fetch("/api/upload", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ filename, mimeType, size, sha256 })
});
const { data } = await res.json();

if (data.alreadyExists) {
  // Instant! No upload needed.
  console.log("Share URL:", \`https://tempfile.io/f/\${data.shareId}\`);
} else {
  // 3. Upload directly to GCS (no proxy)
  await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: file
  });

  // 4. Confirm upload
  await fetch("/api/upload/confirm", {
    method: "POST",
    body: JSON.stringify({ shareId: data.shareId })
  });

  console.log("Share URL:", \`https://tempfile.io/f/\${data.shareId}\`);
}`}</pre>
            </div>
          </div>
        </FadeIn>

        {/* Endpoints */}
        <FadeIn delay={0.15}>
          <SectionMarker index={2} total={3} label="Endpoints" />
          <div className="space-y-8">
            {endpoints.map((ep, i) => (
              <FadeIn key={ep.path} delay={i * 0.03}>
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="border-b border-border px-5 py-3 flex items-center gap-3 bg-muted/10">
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-foreground bg-muted border border-border rounded-sm px-2 py-0.5">
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm text-foreground">
                      {ep.path}
                    </code>
                    <span className="ml-auto font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground">
                      Auth: {ep.auth}
                    </span>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {ep.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          Request
                        </p>
                        <pre className="font-mono text-[11px] text-foreground bg-muted/20 border border-border rounded-md p-3 overflow-x-auto leading-relaxed">
                          {ep.request}
                        </pre>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                          Response
                        </p>
                        <pre className="font-mono text-[11px] text-foreground bg-muted/20 border border-border rounded-md p-3 overflow-x-auto leading-relaxed">
                          {ep.response}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Rate limits */}
        <FadeIn delay={0.2}>
          <SectionMarker index={3} total={3} label="Rate Limits" />
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/20 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-right border-l border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Uploads/hr
                  </th>
                  <th className="px-4 py-3 text-right border-l border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Downloads/file
                  </th>
                  <th className="px-4 py-3 text-right border-l border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Storage quota
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { plan: "Free", uploads: "20", downloads: "10", quota: "1 GB" },
                  { plan: "Starter", uploads: "200", downloads: "∞", quota: "10 GB" },
                  { plan: "Pro", uploads: "200", downloads: "∞", quota: "50 GB" },
                  { plan: "Enterprise", uploads: "1,000", downloads: "∞", quota: "500 GB" },
                ].map((row) => (
                  <tr key={row.plan} className="border-t border-border hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">{row.plan}</td>
                    <td className="px-4 py-3 text-right border-l border-border font-mono text-xs tabular-nums text-foreground">{row.uploads}</td>
                    <td className="px-4 py-3 text-right border-l border-border font-mono text-xs tabular-nums text-foreground">{row.downloads}</td>
                    <td className="px-4 py-3 text-right border-l border-border font-mono text-xs tabular-nums text-foreground">{row.quota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
