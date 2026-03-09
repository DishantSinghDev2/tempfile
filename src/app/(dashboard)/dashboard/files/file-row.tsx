// src/app/(dashboard)/dashboard/files/file-row.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { formatBytes, formatCountdown } from "@/lib/utils";
import type { File } from "@/lib/db/schema";

interface Props {
  file: File;
}

export function FileRow({ file }: Props) {
  const [deleted, setDeleted] = useState(false);

  const isExpired =
    file.expiresAt < new Date() ||
    file.status === "expired" ||
    file.status === "deleted";

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${file.shareId}`);
    toast.success("Link copied");
  };

  const deleteFile = async () => {
    const res = await fetch(`/api/files?id=${file.id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleted(true);
      toast.success("File deleted");
    } else {
      toast.error("Delete failed");
    }
  };

  if (deleted) return null;

  return (
    <tr className="border-t border-border hover:bg-muted/10 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="text-xs font-medium text-foreground truncate max-w-[200px]">
            {file.originalFilename}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {file.shareId}
          </p>
        </div>
      </td>
      <td className="px-4 py-3 border-l border-border text-right">
        <span className="font-mono text-xs text-foreground tabular-nums">
          {formatBytes(file.size)}
        </span>
      </td>
      <td className="px-4 py-3 border-l border-border text-right">
        <span className="font-mono text-xs text-foreground tabular-nums">
          {file.downloadCount}
          {file.maxDownloads !== null && (
            <span className="text-muted-foreground">/{file.maxDownloads}</span>
          )}
        </span>
      </td>
      <td className="px-4 py-3 border-l border-border text-right">
        <span className={`font-mono text-xs tabular-nums ${isExpired ? "text-muted-foreground" : "text-foreground"}`}>
          {isExpired ? "Expired" : formatCountdown(file.expiresAt.toISOString())}
        </span>
      </td>
      <td className="px-4 py-3 border-l border-border">
        <span className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground">
          {file.status}
        </span>
      </td>
      <td className="px-4 py-3 border-l border-border">
        <div className="flex items-center gap-1.5 justify-end">
          {!isExpired && (
            <>
              <button
                onClick={copyLink}
                className="h-7 w-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Copy link"
              >
                <Copy className="h-3 w-3" />
              </button>
              <Link
                href={`/f/${file.shareId}`}
                target="_blank"
                className="h-7 w-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Open"
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
            </>
          )}
          <button
            onClick={deleteFile}
            className="h-7 w-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </td>
    </tr>
  );
}
