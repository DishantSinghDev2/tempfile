// src/app/api/files/[shareId]/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const sendEmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  const { env } = getCloudflareContext();
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await request.json();
    const parsed = sendEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Fetch file details
    const db = getDb();
    const fileResult = await db
      .select({
        filename: schema.files.originalFilename,
        size: schema.files.size,
      })
      .from(schema.files)
      .where(eq(schema.files.shareId, shareId))
      .limit(1);

    if (fileResult.length === 0) {
      return NextResponse.json(
        { success: false, error: "File not found." },
        { status: 404 }
      );
    }

    const file = fileResult[0];
    const shareUrl = `${request.nextUrl.origin}/f/${shareId}`;

    // Send email using Resend
    await resend.emails.send({
      from: "Temp File <noreply@tfile.freecustom.email>",
      to: email,
      subject: "A file has been shared with you on Temp File",
      html: `
        <p>Someone has shared a file with you via Temp File.</p>
        <p>
          <strong>File:</strong> ${file.filename}<br>
          <strong>Size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
        <p>
          You can download the file here: <a href="${shareUrl}">${shareUrl}</a>
        </p>
        <p>This link will expire and the file will be deleted automatically.</p>
        <hr>
        <p><small>Shared with Temp File by FCE</small></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}
