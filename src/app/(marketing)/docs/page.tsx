// src/app/(marketing)/docs/page.tsx
"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useEffect, useState } from "react";

export default function DocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch("/openapi.json")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("Failed to load openapi.json", err));
  }, []);

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
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
            /* Hide Scalar header and footer if they have them */
            header, footer {
              display: none !important;
            }
          `,
        }}
        spec={spec}
      />
    </div>
  );
}
