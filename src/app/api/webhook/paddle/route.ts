// src/app/api/webhook/paddle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import {
  verifyPaddleWebhook,
  getPlanFromPriceId,
} from "@/lib/billing/paddle";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const signature = request.headers.get("paddle-signature") ?? "";
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET ?? "";

  const isValid = await verifyPaddleWebhook(body, signature, webhookSecret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event_type: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const db = getDb();

  try {
    switch (event.event_type) {
      case "subscription.created":
      case "subscription.activated": {
        const sub = event.data as {
          id: string;
          customer_id: string;
          custom_data?: { user_id?: string };
          status: string;
          current_billing_period?: { ends_at: string };
          items?: Array<{ price: { id: string } }>;
        };

        const userId = sub.custom_data?.user_id;
        if (!userId) break;

        const priceId = sub.items?.[0]?.price.id ?? "";
        const planTier = getPlanFromPriceId(priceId) ?? "free";
        const periodEnd = sub.current_billing_period?.ends_at
          ? new Date(sub.current_billing_period.ends_at)
          : new Date(Date.now() + 30 * 24 * 3600 * 1000);

        // Upsert subscription
        await db
          .insert(schema.subscriptions)
          .values({
            id: nanoid(21),
            userId,
            paddleSubscriptionId: sub.id,
            paddleCustomerId: sub.customer_id,
            status: "active",
            planTier,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
            paddlePriceId: priceId,
          })
          .onConflictDoUpdate({
            target: schema.subscriptions.paddleSubscriptionId,
            set: {
              status: "active",
              planTier,
              currentPeriodEnd: periodEnd,
              updatedAt: new Date(),
            },
          });

        // Update user's plan tier
        await db
          .update(schema.users)
          .set({ planTier, updatedAt: new Date() })
          .where(eq(schema.users.id, userId));
        break;
      }

      case "subscription.canceled": {
        const sub = event.data as { id: string };
        await db
          .update(schema.subscriptions)
          .set({ status: "canceled", cancelAtPeriodEnd: true, updatedAt: new Date() })
          .where(eq(schema.subscriptions.paddleSubscriptionId, sub.id));
        break;
      }

      case "subscription.past_due": {
        const sub = event.data as { id: string };
        await db
          .update(schema.subscriptions)
          .set({ status: "past_due", updatedAt: new Date() })
          .where(eq(schema.subscriptions.paddleSubscriptionId, sub.id));
        break;
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
