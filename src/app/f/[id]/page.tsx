// src/app/f/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { SharePageClient } from "./share-page-client";
import { formatBytes } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const results = await db
    .select({
      filename: schema.files.originalFilename,
      size: schema.files.size,
    })
    .from(schema.files)
    .where(eq(schema.files.shareId, id))
    .limit(1);

  if (results.length === 0) {
    return { title: "File Not Found | Temp File" };
  }

  const file = results[0];
  return {
    title: `${file.filename} (${formatBytes(file.size)}) | Temp File`,
    description: `Download ${file.filename} (${formatBytes(file.size)}) — Shared via Temp File. Auto-deleting secure file share.`,
    robots: { index: false, follow: false },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const db = getDb();

  const results = await db
    .select()
    .from(schema.files)
    .where(eq(schema.files.shareId, id))
    .limit(1);

  if (results.length === 0) {
    notFound();
  }

  const file = results[0];
  const isExpired =
    file.expiresAt < new Date() ||
    file.status === "expired" ||
    file.status === "deleted";

  // Fetch form and customization
  const formResults = await db
    .select()
    .from(schema.fileForms)
    .where(eq(schema.fileForms.fileId, file.id))
    .limit(1);

  const customizationResults = await db
    .select()
    .from(schema.fileCustomizations)
    .where(eq(schema.fileCustomizations.fileId, file.id))
    .limit(1);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal nav */}
      <header className="border-b border-border px-6 h-14 flex items-center">
        <a href="/" className="font-mono text-sm font-semibold text-foreground">
          Temp File
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <SharePageClient
          shareId={id}
          file={{
            id: file.shareId,
            filename: file.originalFilename,
            size: file.size,
            mimeType: file.mimeType,
            expiresAt: file.expiresAt.toISOString(),
            downloadCount: file.downloadCount,
            maxDownloads: file.maxDownloads,
            isExpired,
            requiresPassword: !!file.passwordHash,
            form: formResults.length > 0 ? {
              id: formResults[0].id,
              title: formResults[0].title,
              description: formResults[0].description,
              fields: JSON.parse(formResults[0].fields),
              required: formResults[0].required,
              showAt: formResults[0].showAt,
            } : null,
            customization: customizationResults.length > 0 ? {
              theme: customizationResults[0].theme ? JSON.parse(customizationResults[0].theme) : null,
              donateButtonUrl: customizationResults[0].donateButtonUrl,
              customText: customizationResults[0].customText,
            } : null,
          }}
        />
      </main>

      <footer className="border-t border-border px-6 py-4 flex items-center justify-between">
        <p className="font-mono text-[10px] text-muted-foreground">
          Temp File — Ephemeral file sharing
        </p>
        <a
          href="/pricing"
          className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border"
        >
          Share your own files →
        </a>
      </footer>
    </div>
  );
}
