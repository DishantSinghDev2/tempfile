// src/components/layout/nav.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
            <Upload className="h-3 w-3 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            TempFile
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/docs"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          <Link
            href="/dashboard"
            className="h-8 px-3 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
