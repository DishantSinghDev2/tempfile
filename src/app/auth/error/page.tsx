// src/app/auth/error/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Auth Error — TempFile",
  robots: { index: false },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const errors: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An unexpected error occurred during authentication.",
    OAuthSignin: "Error starting the OAuth sign-in flow.",
    OAuthCallback: "Error during OAuth callback.",
    OAuthCreateAccount: "Could not create an account with this OAuth provider.",
    EmailCreateAccount: "Could not create an account with this email.",
    Callback: "Error during callback.",
    OAuthAccountNotLinked:
      "This email is already associated with a different sign-in method.",
    SessionRequired: "Please sign in to access this page.",
  };

  const message = error ? (errors[error] ?? errors.Default) : errors.Default;

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-lg border border-border flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Authentication error
            </h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {message}
            </p>
            {error && (
              <p className="font-mono text-[10px] text-muted-foreground mt-2 border border-border rounded-sm px-2 py-1 inline-block">
                Code: {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/signin"
            className="h-9 px-4 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="h-9 px-4 text-xs font-mono border border-border text-foreground rounded-md flex items-center hover:bg-muted transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
