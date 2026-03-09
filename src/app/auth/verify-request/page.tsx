// src/app/auth/verify-request/page.tsx
import type { Metadata } from "next";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Check your email — Temp File",
  robots: { index: false },
};

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground mt-2 px-4">
              A magic link has been sent to your email address. Click the link to sign in securely.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground text-center">
            Didn't receive the email? Check your spam folder or try signing in again.
          </p>
          <Link
            href="/auth/signin"
            className="flex items-center gap-2 text-sm text-foreground hover:underline underline-offset-4 decoration-border transition-all"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
