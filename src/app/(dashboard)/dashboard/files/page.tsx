// src/app/(dashboard)/dashboard/files/page.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getUserFiles } from "@/lib/file-service";
import { formatBytes, formatCountdown } from "@/lib/utils";
import { FileRow } from "./file-row";

export const metadata: Metadata = {
  title: "My Files — Temp File",
  robots: { index: false },
};

export default async function FilesPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const planTier = (session!.user as any).planTier || "free";

  const files = await getUserFiles(userId, 1, 50);

  return (
    <div className="py-10 px-6 md:px-10 max-w-5xl">
      <div className="mb-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Files
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">
          Your files
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {files.length} file{files.length !== 1 ? "s" : ""} ·{" "}
          {formatBytes(files.reduce((acc, f) => acc + f.size, 0))} total
        </p>
      </div>

      {files.length === 0 ? (
        <div className="border border-border rounded-lg p-12 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">No files yet.</p>
          <a
            href="/dashboard"
            className="h-8 px-3 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
          >
            Upload your first file
          </a>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm">
            <thead>
              <tr className="bg-muted/20 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  File
                </th>
                <th className="px-4 py-3 text-right border-l border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Size
                </th>
                <th className="px-4 py-3 text-right border-l border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Downloads
                </th>
                <th className="px-4 py-3 text-right border-l border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Expires
                </th>
                <th className="px-4 py-3 border-l border-border font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 border-l border-border" />
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <FileRow key={file.id} file={file} planTier={planTier} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
