// src/app/auth/signin/signin-buttons.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { SiGithub, SiGoogle } from "react-icons/si";
import { Loader2 } from "lucide-react";

export function SignInButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="space-y-2.5">
      <button
        onClick={() => handleSignIn("github")}
        disabled={!!loading}
        className="w-full h-10 flex items-center justify-center gap-3 border border-border rounded-md text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "github" ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <SiGithub className="h-4 w-4" />
        )}
        Continue with GitHub
      </button>

      <button
        onClick={() => handleSignIn("google")}
        disabled={!!loading}
        className="w-full h-10 flex items-center justify-center gap-3 border border-border rounded-md text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <SiGoogle className="h-4 w-4" />
        )}
        Continue with Google
      </button>
    </div>
  );
}
