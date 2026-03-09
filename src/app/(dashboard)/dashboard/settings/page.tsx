// src/app/(dashboard)/dashboard/settings/page.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Settings — Temp File",
  robots: { index: false },
};

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const db = getDb();

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  return (
    <div className="py-10 px-6 md:px-10 max-w-2xl">
      <div className="mb-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Settings
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
          Account Settings
        </h1>
      </div>

      <SettingsClient
        user={{
          id: userId,
          name: session!.user!.name ?? "",
          email: session!.user!.email ?? "",
          image: session!.user!.image ?? undefined,
          planTier: user?.planTier ?? "free",
          createdAt: user?.createdAt?.toISOString() ?? new Date().toISOString(),
          defaultCustomization: user?.defaultCustomization || null,
        }}
      />
    </div>
  );
}
