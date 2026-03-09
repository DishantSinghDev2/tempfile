// src/app/api/files/[shareId]/form/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getClientIp } from "@/lib/utils";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const ip = getClientIp(request);
  const body = await request.json();
  const { data, formId } = body;

  const db = getDb();

  // Find the file to get its internal ID
  const fileResults = await db
    .select({ id: schema.files.id })
    .from(schema.files)
    .where(eq(schema.files.shareId, shareId))
    .limit(1);

  if (fileResults.length === 0) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileId = fileResults[0].id;

  try {
    await db.insert(schema.formSubmissions).values({
      id: nanoid(21),
      formId,
      fileId,
      data: JSON.stringify(data),
      downloaderIp: ip,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Form submission error:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
