// src/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/lib/db/client";
import { schema } from "@/lib/db/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const { auth, handlers, signIn, signOut } = NextAuth(() => {
  const ctx = getCloudflareContext();
  const env = ctx.env;

  const db = getDb();
  return {
    adapter: DrizzleAdapter(db, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    } as any),
    providers: [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID!,
        clientSecret: env.GITHUB_CLIENT_SECRET!,
        profile(profile) {
          return {
            id: profile.id.toString(),
            name: profile.name ?? profile.login,
            email: profile.email ?? `${profile.login}@users.noreply.github.com`,
            image: profile.avatar_url,
          };
        },
      }),
      Google({
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          };
        },
      }),
      Resend({
        apiKey: env.RESEND_API_KEY,
        from: `Temp File <noreply@${new URL(env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").hostname}>`,
      }),
    ],
    secret: env.AUTH_SECRET,
    trustHost: true,
    session: {
      strategy: "database",
    },
    pages: {
      signIn: "/auth/signin",
      verifyRequest: "/auth/verify-request",
      error: "/auth/error",
    },
    callbacks: {
      session({ session, user }) {
        if (session.user && user) {
          session.user.id = user.id;
        }
        return session;
      },
    },
  };
});
