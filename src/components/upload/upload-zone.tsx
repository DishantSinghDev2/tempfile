// src/components/upload/upload-zone.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  CheckCircle,
  X,
  Copy,
  Share2,
  Zap,
  Clock,
  Send,
  Mail,
  Loader2,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { computeSHA256, formatBytes, formatCountdown } from "@/lib/utils";
import type { UploadResponse } from "@/types";
import { Turnstile } from "@marsidev/react-turnstile";
import { useUpload } from "@/hooks/use-upload";

type UploadState =
  | { phase: "idle" }
  | { phase: "hashing"; progress: number }
  | { phase: "dedup_check" }
  | { phase: "uploading"; progress: number; filename: string; speedBps?: number; timeLeftSeconds?: number }
  | {
      phase: "done";
      shareId: string;
      expiresAt: string;
      instant: boolean;
      filename: string;
    }
  | { phase: "error"; message: string };

interface UploadZoneProps {
  maxSizeMb?: number;
  expiryHours?: number;
  planTier?: string;
}

const SHARE_BASE = typeof window !== "undefined" ? window.location.origin : "";

export function UploadZone({
  maxSizeMb = 100,
  expiryHours = 24,
  planTier = "free",
}: UploadZoneProps) {
  const [state, setState] = useState<UploadState>({ phase: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<any>(null);
  const pendingFileRef = useRef<File | null>(null);
  const { upload, state: uploadState } = useUpload();

  const formatSpeed = (bps?: number) => {
    if (!bps) return "Calculating...";
    if (bps > 1024 * 1024) return `${(bps / (1024 * 1024)).toFixed(1)} MB/s`;
    if (bps > 1024) return `${(bps / 1024).toFixed(1)} KB/s`;
    return `${bps.toFixed(0)} B/s`;
  };

  const formatTime = (seconds?: number) => {
    if (seconds === undefined || !isFinite(seconds)) return "Calculating...";
    if (seconds < 60) return `${Math.ceil(seconds)}s left`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    return `${mins}m ${secs}s left`;
  };

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.phase !== "done" || !email || !state.shareId) return;

    setSendingEmail(true);
    try {
      const res = await fetch(`/api/files/${state.shareId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Email sent successfully!");
        setEmail("");
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to send email.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > maxSizeMb * 1024 * 1024) {
        setState({
          phase: "error",
          message: `File too large. Max size is ${maxSizeMb} MB on your current plan.`,
        });
        return;
      }

      if (!turnstileToken) {
        // Store the file and trigger turnstile execution
        pendingFileRef.current = file;
        
        if (turnstileRef.current?.execute) {
          turnstileRef.current.execute();
          toast.loading("Verifying security...", { id: "turnstile-exec" });
        } else {
          toast.error("Please complete the security check before uploading.");
        }
        return;
      }

      try {
        // Step 1: Hash the file client-side
        setState({ phase: "hashing", progress: 0 });
        const sha256 = await computeSHA256(file);
        setState({ phase: "dedup_check" });

        // Step 2: Request upload URL (dedup check happens server-side)
        const uploadReq = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
            sha256,
            expiryHours,
            turnstileToken,
            password: password || null,
          }),
        });

        if (!uploadReq.ok) {
          const err = await uploadReq.json();
          throw new Error(err.error ?? "Upload request failed");
        }

        const { data } = (await uploadReq.json()) as {
          data: UploadResponse;
        };

        // Step 3: Instant dedup — file already exists
        if (data.alreadyExists) {
          setState({
            phase: "done",
            shareId: data.shareId,
            expiresAt: data.expiresAt,
            instant: true,
            filename: file.name,
          });
          toast.success("Instant upload — file already in cache!");
          return;
        }

        // Step 4: Direct upload to GCS (never through our server)
        setState({ phase: "uploading", progress: 0, filename: file.name, speedBps: 0, timeLeftSeconds: 0 });

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const startTime = Date.now();
          let lastLoaded = 0;
          let lastTime = startTime;

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const now = Date.now();
              const timeDiff = (now - lastTime) / 1000;
              const percent = Math.round((e.loaded / e.total) * 100);

              if (timeDiff > 0.5) { // Update speed every 500ms
                const bytesDiff = e.loaded - lastLoaded;
                const speedBps = bytesDiff / timeDiff;
                const remainingBytes = e.total - e.loaded;
                const timeLeftSeconds = speedBps > 0 ? remainingBytes / speedBps : 0;

                setState({
                  phase: "uploading",
                  progress: percent,
                  filename: file.name,
                  speedBps,
                  timeLeftSeconds
                });

                lastLoaded = e.loaded;
                lastTime = now;
              } else {
                 setState((s) => ({
                  ...(s as Extract<UploadState, { phase: "uploading" }>),
                  progress: percent,
                  filename: file.name,
                }));
              }
            }
          });
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error(`Upload failed: ${xhr.status}`));
          });
          xhr.addEventListener("error", () => reject(new Error("Network error")));
          xhr.open("PUT", data.uploadUrl!);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.send(file);
        });

        // Step 5: Confirm upload
        await fetch("/api/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shareId: data.shareId }),
        });

        setState({
          phase: "done",
          shareId: data.shareId,
          expiresAt: data.expiresAt,
          instant: false,
          filename: file.name,
        });
      } catch (err) {
        setState({
          phase: "error",
          message: err instanceof Error ? err.message : "Upload failed",
        });
      }
    },
    [maxSizeMb, expiryHours, turnstileToken]
  );

  useEffect(() => {
    if (turnstileToken && pendingFileRef.current) {
      const file = pendingFileRef.current;
      pendingFileRef.current = null;
      handleFile(file);
    }
  }, [turnstileToken, handleFile]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const shareUrl =
    state.phase === "done"
      ? `${SHARE_BASE}/f/${state.shareId}`
      : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  const reset = () => {
    setState({ phase: "idle" });
    setEmail("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* IDLE STATE */}
        {state.phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-16 cursor-pointer
                flex flex-col items-center justify-center gap-5
                transition-all duration-200
                ${dragOver
                  ? "border-foreground bg-muted/20"
                  : "border-border hover:border-foreground/40 hover:bg-muted/10"
                }
              `}
            >
              {/* Dot grid */}
              <div
                className="absolute inset-0 rounded-lg opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, hsl(0 0% 50% / 0.11) 1px, transparent 0)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div className="relative flex flex-col items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-lg border border-border flex items-center justify-center transition-colors ${
                    dragOver ? "bg-foreground" : "bg-muted/20"
                  }`}
                >
                  <Upload
                    className={`h-6 w-6 transition-colors ${dragOver ? "text-background" : "text-muted-foreground"}`}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Drop file here, or{" "}
                    <span className="underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors cursor-pointer">
                      browse
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Up to {maxSizeMb} MB · Auto-deletes in {expiryHours}h ·
                    No login required
                  </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    "SHA-256 dedup",
                    "Direct to CDN",
                    "Zero proxy",
                    "Auto-delete",
                  ].map((f) => (
                    <span
                      key={f}
                      className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {planTier !== "free" && (
                  <div className="w-full max-w-[200px] space-y-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPassword(!showPassword);
                      }}
                      className="w-full text-[9px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Lock className="h-3 w-3" />
                      {showPassword ? "Remove password" : "Add password"}
                    </button>
                    {showPassword && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password..."
                          className="w-full h-7 px-2 text-[10px] font-mono bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                    )}
                  </div>
                )}

                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACoPb9se4s9TrYCe"}
                  onSuccess={(token) => {
                    setTurnstileToken(token);
                    toast.dismiss("turnstile-exec");
                  }}
                  onError={() => {
                    toast.error("Security check failed. Please try again.", { id: "turnstile-exec" });
                    pendingFileRef.current = null;
                  }}
                  onExpire={() => {
                    setTurnstileToken(null);
                    pendingFileRef.current = null;
                    toast.error("Security session expired. Please try again.", { id: "turnstile-exec" });
                  }}
                  options={{
                    theme: "light",
                    size: "invisible",
                  }}
                />
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </motion.div>
        )}

        {/* HASHING / DEDUP CHECK */}
        {(state.phase === "hashing" || state.phase === "dedup_check") && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-border rounded-lg p-12 flex flex-col items-center gap-6"
          >
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-lg border border-border animate-pulse" />
              <div className="w-14 h-14 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-sm font-medium text-foreground">
                {state.phase === "hashing"
                  ? "Computing file fingerprint..."
                  : "Checking deduplication cache..."}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {state.phase === "hashing" ? "SHA-256 hash" : "Instant if file exists"}
              </p>
            </div>
            <div className="w-full max-w-xs bg-muted rounded-full h-px overflow-hidden">
              <div className="h-full bg-foreground/40 progress-indeterminate w-1/3 rounded-full" />
            </div>
          </motion.div>
        )}

        {/* UPLOADING */}
        {state.phase === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-border rounded-lg p-12 flex flex-col items-center gap-6"
          >
            <div className="w-14 h-14 rounded-lg border border-border flex items-center justify-center">
              <Upload className="h-6 w-6 text-foreground animate-bounce" />
            </div>
            <div className="text-center space-y-1.5 w-full max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {state.filename}
                </p>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {state.progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-px overflow-hidden">
                <motion.div
                  className="h-full bg-foreground rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${state.progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="flex justify-between w-full mt-1 text-xs font-mono text-muted-foreground">
                <span>{formatSpeed(state.speedBps)}</span>
                <span>{formatTime(state.timeLeftSeconds)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* DONE */}
        {state.phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="border border-border rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center bg-muted/20">
                  <CheckCircle className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      File shared
                    </p>
                    {state.instant && (
                      <span className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1.5 py-px text-muted-foreground">
                        Instant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate max-w-[240px]">
                    {state.filename}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Upload another file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Share URL & Email Form */}
            <div className="p-6 space-y-4">
              <form onSubmit={handleEmailSend} className="w-full flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email to..."
                    className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="h-10 px-4 flex items-center justify-center gap-2 rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {sendingEmail ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send
                </button>
              </form>
              <div className="flex items-center gap-2 bg-muted/20 border border-border rounded-md px-3 py-2.5">
                <span className="font-mono text-xs text-foreground flex-1 truncate select-all">
                  {shareUrl}
                </span>
                <button
                  onClick={copyLink}
                  className="shrink-0 h-7 w-7 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
                  aria-label="Copy link"
                >
                  <Copy className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono text-xs">
                    Auto-deletes in{" "}
                    <span className="text-foreground font-semibold tabular-nums">
                      {formatCountdown(state.expiresAt)}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyLink}
                    className="h-8 px-3 text-xs font-mono bg-foreground text-background rounded-md flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Link
                  </button>
                  <a
                    href={`/f/${state.shareId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 text-xs font-mono border border-border text-foreground rounded-md flex items-center gap-1.5 hover:bg-muted transition-colors"
                  >
                    <Share2 className="h-3 w-3" />
                    Open
                  </a>
                </div>
              </div>
            </div>

            {/* Upload another */}
            <div className="border-t border-border px-6 py-3">
              <button
                onClick={reset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
              >
                + Upload another file
              </button>
            </div>
          </motion.div>
        )}

        {/* ERROR */}
        {state.phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-border rounded-lg p-8 flex flex-col items-center gap-5 text-center"
          >
            <div className="w-12 h-12 rounded-lg border border-border flex items-center justify-center">
              <X className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">Upload failed</p>
              <p className="text-xs text-muted-foreground max-w-sm">{state.message}</p>
            </div>
            <button
              onClick={reset}
              className="h-8 px-4 text-xs font-mono bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
