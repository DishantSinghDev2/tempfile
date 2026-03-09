// src/lib/billing/paddle.ts
import { PLANS } from "@/lib/plans";
import type { PlanTier } from "@/types";

const PADDLE_API_BASE = "https://api.paddle.com";

interface PaddleCheckoutSession {
  id: string;
  url: string;
}

interface PaddleSubscription {
  id: string;
  status: string;
  customer_id: string;
  current_billing_period: {
    ends_at: string;
  };
  scheduled_change?: {
    action: string;
    effective_at: string;
  };
  items: Array<{
    price: { id: string };
    quantity: number;
  }>;
}

export async function createCheckoutSession(params: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  paddleApiKey: string;
}): Promise<PaddleCheckoutSession> {
  const { priceId, userId, userEmail, successUrl, cancelUrl, paddleApiKey } =
    params;

  const response = await fetch(`${PADDLE_API_BASE}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paddleApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      customer: { email: userEmail },
      custom_data: { user_id: userId },
      checkout: {
        url: successUrl,
        settings: {
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Paddle error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return {
    id: data.data.id,
    url: data.data.checkout?.url ?? "",
  };
}

export async function cancelSubscription(
  subscriptionId: string,
  paddleApiKey: string
): Promise<void> {
  const response = await fetch(
    `${PADDLE_API_BASE}/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paddleApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ effective_from: "next_billing_period" }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to cancel subscription");
  }
}

export async function getSubscription(
  subscriptionId: string,
  paddleApiKey: string
): Promise<PaddleSubscription> {
  const response = await fetch(
    `${PADDLE_API_BASE}/subscriptions/${subscriptionId}`,
    {
      headers: { Authorization: `Bearer ${paddleApiKey}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch subscription");
  }

  const data = await response.json();
  return data.data;
}

export function getPlanFromPriceId(priceId: string): PlanTier | null {
  for (const plan of PLANS) {
    if (
      plan.paddlePriceIdMonthly === priceId ||
      plan.paddlePriceIdYearly === priceId
    ) {
      return plan.tier;
    }
  }
  return null;
}

// Paddle webhook signature verification
export async function verifyPaddleWebhook(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(payload);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const [, hash] = signature.split(";h1=");
    if (!hash) return false;

    const sigBuffer = Uint8Array.from(
      hash.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []
    );

    return crypto.subtle.verify("HMAC", cryptoKey, sigBuffer, msgData);
  } catch {
    return false;
  }
}
