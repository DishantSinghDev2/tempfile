// src/app/(dashboard)/dashboard/page.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db/client";
import { eq, sql } from "drizzle-orm";
import { formatBytes } from "@/lib/utils";
import { UploadZone } from "@/components/upload/upload-zone";
import Link from "next/link";
import { Files, HardDrive, Download, ArrowRight } from "lucide-react";
import { getPlan } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Dashboard — TempFile",
  robots: { index: false },
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const db = getDb();

  // Get stats
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  const stats = await db
    .select({
      totalFiles: sql<number>`count(*)`,
      totalSize: sql<number>`sum(${schema.files.size})`,
      totalDownloads: sql<number>`sum(${schema.files.downloadCount})`,
    })
    .from(schema.files)
    .where(eq(schema.files.userId, userId));

  const userData = user[0];
  const plan = getPlan(userData?.planTier ?? "free");

  const statCards = [
    {
      label: "Active files",
      value: stats[0]?.totalFiles?.toString() ?? "0",
      icon: Files,
    },
    {
      label: "Total stored",
      value: formatBytes(stats[0]?.totalSize ?? 0),
      icon: HardDrive,
    },
    {
      label: "Total downloads",
      value: (stats[0]?.totalDownloads ?? 0).toString(),
      icon: Download,
    },
  ];

  return (
    <div className="py-10 px-6 md:px-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Dashboard
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground">
            {plan.name}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="bg-background px-5 py-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center">
              <s.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-mono text-xl font-semibold tabular-nums text-foreground">
                {s.value}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick upload */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Quick upload</h2>
          <Link
            href="/dashboard/files"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono flex items-center gap-1"
          >
            View all files
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <UploadZone maxSizeMb={plan.maxFileSizeMb} expiryHours={plan.maxExpiryDays * 24} />
      </div>

      {/* Plan info */}
      <div className="border border-border rounded-lg p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {plan.name} plan
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {plan.maxFileSizeMb >= 1024
              ? `${plan.maxFileSizeMb / 1024} GB`
              : `${plan.maxFileSizeMb} MB`}{" "}
            max · {plan.maxExpiryDays}d expiry ·{" "}
            {plan.creditsMonthly > 0
              ? `${plan.creditsMonthly} credits/mo`
              : "No credits"}
          </p>
        </div>
        {plan.tier === "free" && (
          <Link
            href="/pricing"
            className="h-8 px-3 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
          >
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
}
