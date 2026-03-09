// src/app/api/billing/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cancelSubscription } from "@/lib/billing/paddle";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema_ = z.object({ subscriptionId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema_.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { subscriptionId } = parsed.data;
  const db = getDb();

  // Verify this subscription belongs to the requesting user
  const [sub] = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.paddleSubscriptionId, subscriptionId))
    .limit(1);

  if (!sub || sub.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await cancelSubscription(subscriptionId, process.env.PADDLE_API_KEY!);
    await db
      .update(schema.subscriptions)
      .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
      .where(eq(schema.subscriptions.paddleSubscriptionId, subscriptionId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel error:", err);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
