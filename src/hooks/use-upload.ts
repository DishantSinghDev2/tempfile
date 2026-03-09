// src/hooks/use-upload.ts
"use client";

import { useState, useCallback } from "react";
import { computeSHA256 } from "@/lib/utils";
import type { UploadResponse } from "@/types";

export type UploadStatus =
  | "idle"
  | "hashing"
  | "checking"
  | "uploading"
  | "confirming"
  | "done"
  | "error";

export interface UploadState {
  status: UploadStatus;
  progress: number;
  shareId?: string;
  expiresAt?: string;
  instant?: boolean;
  error?: string;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    status: "idle",
    progress: 0,
  });

  const upload = useCallback(
    async (
      file: File,
      options?: {
        expiryHours?: number;
        maxDownloads?: number | null;
      }
    ) => {
      setState({ status: "hashing", progress: 0 });

      try {
        // Step 1: Hash
        const sha256 = await computeSHA256(file);
        setState({ status: "checking", progress: 0 });

        // Step 2: Request URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            sha256,
            expiryHours: options?.expiryHours ?? 24,
            maxDownloads: options?.maxDownloads ?? null,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Upload request failed");
        }

        const { data } = (await res.json()) as { data: UploadResponse };

        if (data.alreadyExists) {
          setState({
            status: "done",
            progress: 100,
            shareId: data.shareId,
            expiresAt: data.expiresAt,
            instant: true,
          });
          return data;
        }

        // Step 3: Upload to GCS
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              setState((s) => ({
                ...s,
                status: "uploading",
                progress: Math.round((e.loaded / e.total) * 100),
              }));
            }
          });
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed: ${xhr.status}`));
          });
          xhr.addEventListener("error", () => reject(new Error("Network error")));
          xhr.open("PUT", data.uploadUrl!);
          xhr.setRequestHeader(
            "Content-Type",
            file.type || "application/octet-stream"
          );
          xhr.send(file);
        });

        // Step 4: Confirm
        setState((s) => ({ ...s, status: "confirming", progress: 100 }));
        await fetch("/api/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shareId: data.shareId }),
        });

        setState({
          status: "done",
          progress: 100,
          shareId: data.shareId,
          expiresAt: data.expiresAt,
          instant: false,
        });

        return data;
      } catch (err) {
        const error = err instanceof Error ? err.message : "Upload failed";
        setState({ status: "error", progress: 0, error });
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ status: "idle", progress: 0 });
  }, []);

  return { state, upload, reset };
}
