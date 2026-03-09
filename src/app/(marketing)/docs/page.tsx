// src/app/(marketing)/docs/page.tsx
"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1">
        <ApiReferenceReact
          configuration={{
            theme: "none",
            layout: "modern",
            customCss: `
              :root {
                --scalar-color-1: var(--foreground);
                --scalar-color-2: var(--muted-foreground);
                --scalar-background-1: var(--background);
                --scalar-background-2: var(--muted);
                --scalar-border-color: var(--border);
                --scalar-font-size-1: 14px;
                --scalar-button-1: var(--foreground);
                --scalar-button-color-1: var(--background);
              }
              .scalar-app {
                background-color: var(--background) !important;
                --scalar-sidebar-background: var(--background);
              }
              .section-container {
                padding-top: 4rem;
              }
              .sidebar {
                border-right: 1px solid var(--border);
              }
            `,
          }}
          // @ts-ignore
          spec={{
            url: "/openapi.json",
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
