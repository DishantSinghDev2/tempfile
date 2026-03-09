// src/app/auth/signin/page.tsx
import type { Metadata } from "next";
import { SignInButtons } from "./signin-buttons";
import { Upload } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — Temp File",
  robots: { index: false },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-foreground rounded-md flex items-center justify-center">
            <Upload className="h-5 w-5 text-background" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Sign in to Temp File
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              File history, extended expiry, and API access
            </p>
          </div>
        </div>

        {/* Sign in options */}
        <div className="border border-border rounded-lg p-6 space-y-4">
          <SignInButtons />
          <div className="border-t border-border pt-4">
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              No account required to share files.{" "}
              <a
                href="/"
                className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
              >
                Upload anonymously →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
