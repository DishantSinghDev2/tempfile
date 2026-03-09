// src/app/auth/signin/signin-buttons.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { SiGithub, SiGoogle } from "react-icons/si";
import { Loader2, Mail } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

export function SignInButtons() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<any>(null);

  const handleSignIn = async (provider: string) => {
    if (!turnstileToken) {
      if (turnstileRef.current?.execute) {
        turnstileRef.current.execute();
      } else {
        alert("Please complete the Turnstile verification.");
      }
      return;
    }
    setLoading(provider);
    await signIn(provider, { 
      callbackUrl: "/dashboard",
      email: provider === "resend" ? email : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Email Sign In */}
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
            disabled={!!loading}
          />
        </div>
        <button
          onClick={() => handleSignIn("resend")}
          disabled={!!loading || !email}
          className="w-full h-10 flex items-center justify-center gap-3 bg-foreground text-background rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "resend" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Send Magic Link"
          )}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Sign In */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => handleSignIn("github")}
          disabled={!!loading}
          className="h-10 flex items-center justify-center gap-3 border border-border rounded-md text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "github" ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <SiGithub className="h-4 w-4" />
          )}
          GitHub
        </button>

        <button
          onClick={() => handleSignIn("google")}
          disabled={!!loading}
          className="h-10 flex items-center justify-center gap-3 border border-border rounded-md text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <SiGoogle className="h-4 w-4" />
          )}
          Google
        </button>
      </div>

      {/* Turnstile (Invisible) */}
      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACoPb9se4s9TrYCe"}
        onSuccess={(token) => setTurnstileToken(token)}
        options={{
          theme: "light",
          size: "invisible",
        }}
      />
    </div>
  );
}
