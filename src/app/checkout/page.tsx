// src/app/checkout/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PLANS } from "@/lib/plans";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}) {
  const session = await auth();
  const { plan: planId, interval = "monthly" } = await searchParams;

  if (!session?.user) {
    const params = new URLSearchParams();
    if (planId) params.set("plan", planId);
    if (interval) params.set("interval", interval);
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/checkout?${params.toString()}`)}`);
  }

  const plan = PLANS.find((p) => p.id === planId);
  if (!plan || plan.id === "free") {
    redirect("/pricing");
  }

  // We redirect to dashboard billing where they can confirm and checkout
  // This ensures we have the correct user context and billing state
  redirect(`/dashboard/billing?plan=${planId}&interval=${interval}`);
}
