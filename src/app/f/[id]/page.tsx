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
    return { title: "File Not Found | TempFile" };
  }

  const file = results[0];
  return {
    title: `${file.filename} (${formatBytes(file.size)}) | TempFile`,
    description: `Download ${file.filename} (${formatBytes(file.size)}) — Shared via TempFile. Auto-deleting secure file share.`,
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal nav */}
      <header className="border-b border-border px-6 h-14 flex items-center">
        <a href="/" className="font-mono text-sm font-semibold text-foreground">
          TempFile
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
          }}
        />
      </main>

      <footer className="border-t border-border px-6 py-4 flex items-center justify-between">
        <p className="font-mono text-[10px] text-muted-foreground">
          TempFile — Ephemeral file sharing
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
