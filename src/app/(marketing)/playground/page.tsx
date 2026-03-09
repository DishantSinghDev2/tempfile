// src/app/(marketing)/docs/page.tsx
"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

export default function DocsPage() {
  return (
    <div className="flex-1">
      <ApiReferenceReact
        {...({
          configuration: {
            theme: "none",
            layout: "modern",
            spec: {
              url: "/openapi.json",
            },
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
              header, footer {
                display: none !important;
              }
            `,
          },
        } as any)}
      />
    </div>
  );
}
