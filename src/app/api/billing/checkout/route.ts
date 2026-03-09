// src/app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutSession } from "@/lib/billing/paddle";
import { z } from "zod";

const schema = z.object({
  priceId: z.string().min(1),
  userId: z.string().min(1),
  userEmail: z.string().email(),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { priceId, userId, userEmail } = parsed.data;

  // Ensure requesting user matches
  if (session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const checkout = await createCheckoutSession({
      priceId,
      userId,
      userEmail,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=1`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      paddleApiKey: process.env.PADDLE_API_KEY!,
    });

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
