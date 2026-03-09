// src/app/api/account/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { cancelSubscription } from "@/lib/billing/paddle";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const db = getDb();

  // Cancel any active subscriptions first
  const subs = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.userId, userId));

  for (const sub of subs) {
    if (sub.status === "active" || sub.status === "trialing") {
      try {
        await cancelSubscription(
          sub.paddleSubscriptionId,
          process.env.PADDLE_API_KEY!
        );
      } catch (err) {
        console.error("Failed to cancel sub during account delete:", err);
      }
    }
  }

  // Delete user — cascade will clean up files, sessions, accounts
  await db.delete(schema.users).where(eq(schema.users.id, userId));

  return NextResponse.json({ success: true });
}
