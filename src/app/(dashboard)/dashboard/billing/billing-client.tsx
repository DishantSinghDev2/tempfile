// src/app/(dashboard)/dashboard/billing/billing-client.tsx
"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import type { Plan, PlanTier } from "@/types";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";
import { Lock, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Props {
  currentPlanTier: PlanTier;
  subscriptionId: string | undefined;
  plans: Plan[];
  userEmail: string;
  userId: string;
}

export function BillingClient({
  currentPlanTier,
  subscriptionId,
  plans,
  userEmail,
  userId,
}: Props) {
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<"monthly" | "yearly">(
    (searchParams.get("interval") as "monthly" | "yearly") || "monthly"
  );
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: Plan, selectedBilling?: "monthly" | "yearly") => {
    if (plan.tier === "free" || plan.tier === currentPlanTier) return;

    setLoading(plan.id);
    try {
      const interval = selectedBilling || billing;
      const priceId =
        interval === "monthly"
          ? plan.paddlePriceIdMonthly
          : plan.paddlePriceIdYearly;

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId, userEmail }),
      });

      if (!res.ok) throw new Error("Failed to create checkout");
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    const planId = searchParams.get("plan");
    const interval = searchParams.get("interval") as "monthly" | "yearly";
    if (planId) {
      const plan = plans.find((p) => p.id === planId);
      if (plan && plan.tier !== currentPlanTier) {
        handleUpgrade(plan, interval || undefined);
      }
    }
  }, []);

  const handleCancel = async () => {
    if (!subscriptionId) return;
    setLoading("cancel");
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!res.ok) throw new Error("Failed to cancel");
      toast.success("Subscription will cancel at period end");
    } catch {
      toast.error("Failed to cancel. Contact support.");
    } finally {
      setLoading(null);
    }
  };

  const paidPlans = plans.filter((p) => p.priceMonthly > 0);

  return (
    <div className="space-y-8">
      {/* Billing toggle */}
      <div className="flex items-center gap-1 p-1 border border-border rounded-md w-fit">
        {(["monthly", "yearly"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className={`h-7 px-3 text-xs font-mono rounded transition-colors ${
              billing === b
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {b === "monthly" ? "Monthly" : "Yearly (save ~20%)"}
          </button>
        ))}
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
        {paidPlans.map((plan) => {
          const isCurrent = plan.tier === currentPlanTier;
          const price =
            billing === "monthly" ? plan.priceMonthly : plan.priceYearly / 12;
          const isLoading = loading === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-background p-5 flex flex-col gap-5 ${isCurrent ? "ring-1 ring-foreground/10" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">
                    {plan.name}
                  </span>
                  {isCurrent && (
                    <span className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                    ${price.toFixed(billing === "yearly" ? 2 : 0)}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    /mo
                  </span>
                </div>
                {billing === "yearly" && (
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    Billed ${plan.priceYearly}/year
                  </p>
                )}
              </div>

              <div className="space-y-0 flex-1">
                {plan.features.map((f) => (
                  <div
                    key={f}
                    className="border-t border-border py-2 flex items-start gap-2"
                  >
                    <Check
                      className="h-3 w-3 text-foreground shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <span className="text-xs text-muted-foreground leading-snug">
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent || !!loading}
                className={`w-full h-9 text-xs font-mono rounded-md flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCurrent
                    ? "border border-border text-muted-foreground"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : isCurrent ? (
                  "Current plan"
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="border border-border rounded-md px-3 py-1.5 bg-background flex items-center gap-2">
          <Lock className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            Secure checkout via Paddle
          </span>
        </div>
        {[SiVisa, SiMastercard, SiPaypal].map((Icon, i) => (
          <div
            key={i}
            className="border border-border rounded bg-muted/20 px-2 py-1.5 text-muted-foreground/70"
          >
            <Icon className="h-4 w-4" />
          </div>
        ))}
        <div className="border border-border rounded-md px-2.5 py-1.5 flex items-center gap-1.5">
          <Globe className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-[10px] text-muted-foreground">
            200+ countries
          </span>
        </div>
      </div>

      {/* Money-back */}
      <div className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 bg-background w-fit">
        <ShieldCheck className="h-5 w-5 text-foreground/70 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-foreground">
            7-day money-back guarantee
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Not satisfied? Full refund within 7 days.
          </p>
        </div>
      </div>

      {/* Cancel */}
      {subscriptionId && currentPlanTier !== "free" && (
        <div className="border-t border-border pt-8">
          <h3 className="text-xs font-semibold text-foreground mb-2">
            Cancel subscription
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Your subscription will remain active until the end of the current
            billing period.
          </p>
          <button
            onClick={handleCancel}
            disabled={loading === "cancel"}
            className="h-8 px-3 text-xs font-mono border border-border text-foreground rounded-md flex items-center gap-2 hover:bg-muted transition-colors disabled:opacity-50"
          >
            {loading === "cancel" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Cancel subscription"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
