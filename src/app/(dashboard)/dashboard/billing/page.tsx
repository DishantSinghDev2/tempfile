// src/app/(dashboard)/dashboard/billing/page.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { PLANS, getPlan } from "@/lib/plans";
import { BillingClient } from "./billing-client";

export const metadata: Metadata = {
  title: "Billing — Temp File",
  robots: { index: false },
};

export default async function BillingPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const db = getDb();

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  const [sub] = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.userId, userId))
    .limit(1);

  const currentPlan = getPlan(user?.planTier ?? "free");

  return (
    <div className="py-10 px-6 md:px-10 max-w-3xl">
      <div className="mb-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Billing
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
          Billing & Plans
        </h1>
      </div>

      {/* Current plan */}
      <div className="border border-border rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground">
                Current plan
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {currentPlan.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentPlan.priceMonthly === 0
                ? "Free forever"
                : `$${currentPlan.priceMonthly}/month`}
            </p>
            {sub && (
              <p className="font-mono text-xs text-muted-foreground mt-2">
                {sub.cancelAtPeriodEnd
                  ? `Cancels on ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`
                  : `Renews on ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold tabular-nums text-foreground">
              {user?.creditsRemaining ?? 0}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Credits left
            </p>
          </div>
        </div>
      </div>

      <BillingClient
        currentPlanTier={currentPlan.tier}
        subscriptionId={sub?.paddleSubscriptionId}
        plans={PLANS}
        userEmail={session!.user!.email!}
        userId={userId}
      />
    </div>
  );
}
