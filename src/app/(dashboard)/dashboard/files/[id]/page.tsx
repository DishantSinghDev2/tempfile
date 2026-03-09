// src/app/(dashboard)/dashboard/files/[id]/page.tsx
import { auth } from "@/auth";
import { getDb, schema } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { FileManagementClient } from "./file-management-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FileManagementPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;
  const db = getDb();

  const fileResults = await db
    .select()
    .from(schema.files)
    .where(and(eq(schema.files.id, id), eq(schema.files.userId, session.user.id!)))
    .limit(1);

  if (fileResults.length === 0) {
    notFound();
  }

  const file = fileResults[0];

  const formResults = await db
    .select()
    .from(schema.fileForms)
    .where(eq(schema.fileForms.fileId, id))
    .limit(1);

  const customizationResults = await db
    .select()
    .from(schema.fileCustomizations)
    .where(eq(schema.fileCustomizations.fileId, id))
    .limit(1);

  const submissionResults = await db
    .select()
    .from(schema.formSubmissions)
    .where(eq(schema.formSubmissions.fileId, id))
    .orderBy(schema.formSubmissions.createdAt);

  return (
    <div className="py-10 px-6 md:px-10 max-w-5xl">
      <div className="mb-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Manage File
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1 truncate max-w-xl">
          {file.originalFilename}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share ID: {file.shareId}
        </p>
      </div>

      <FileManagementClient
        file={file}
        initialForm={formResults[0] ? {
          ...formResults[0],
          fields: JSON.parse(formResults[0].fields)
        } : null}
        initialCustomization={customizationResults[0] ? {
          ...customizationResults[0],
          theme: JSON.parse(customizationResults[0].theme || "{}")
        } : null}
        submissions={submissionResults.map(s => ({
          ...s,
          data: JSON.parse(s.data)
        }))}
      />
    </div>
  );
}
