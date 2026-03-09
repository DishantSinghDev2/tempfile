// src/app/api/account/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { defaultCustomization } = body;

  const db = getDb();

  try {
    await db
      .update(schema.users)
      .set({ 
        defaultCustomization: JSON.stringify(defaultCustomization),
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, session.user.id!));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
