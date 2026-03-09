// src/app/api/files/[id]/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { shareId } = await params;
  const body = await request.json();
  const { password, form, customization } = body;

  const db = getDb();

  // Verify ownership
  const fileResults = await db
    .select()
    .from(schema.files)
    .where(and(eq(schema.files.shareId, shareId), eq(schema.files.userId, session.user.id!)))
    .limit(1);

  if (fileResults.length === 0) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const id = fileResults[0].id;

  try {
    // 1. Update password
    if (password !== undefined) {
      await db
        .update(schema.files)
        .set({ passwordHash: password || null })
        .where(eq(schema.files.id, id));
    }

    // 2. Update form
    if (form) {
      const existingForm = await db
        .select()
        .from(schema.fileForms)
        .where(eq(schema.fileForms.fileId, id))
        .limit(1);

      if (existingForm.length > 0) {
        await db
          .update(schema.fileForms)
          .set({
            title: form.title,
            description: form.description,
            fields: JSON.stringify(form.fields),
            required: form.required,
            showAt: form.showAt,
          })
          .where(eq(schema.fileForms.fileId, id));
      } else {
        await db.insert(schema.fileForms).values({
          id: nanoid(21),
          fileId: id,
          title: form.title,
          description: form.description,
          fields: JSON.stringify(form.fields),
          required: form.required,
          showAt: form.showAt,
          createdAt: new Date(),
        });
      }
    } else if (form === null) {
      await db.delete(schema.fileForms).where(eq(schema.fileForms.fileId, id));
    }

    // 3. Update customization
    if (customization) {
      const existingCustom = await db
        .select()
        .from(schema.fileCustomizations)
        .where(eq(schema.fileCustomizations.fileId, id))
        .limit(1);

      if (existingCustom.length > 0) {
        await db
          .update(schema.fileCustomizations)
          .set({
            theme: JSON.stringify(customization.theme),
            donateButtonUrl: customization.donateButtonUrl,
            customText: customization.customText,
          })
          .where(eq(schema.fileCustomizations.fileId, id));
      } else {
        await db.insert(schema.fileCustomizations).values({
          id: nanoid(21),
          fileId: id,
          theme: JSON.stringify(customization.theme),
          donateButtonUrl: customization.donateButtonUrl,
          customText: customization.customText,
          createdAt: new Date(),
        });
      }
    } else if (customization === null) {
      await db.delete(schema.fileCustomizations).where(eq(schema.fileCustomizations.fileId, id));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
