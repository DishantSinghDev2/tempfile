// src/app/f/[id]/share-page-client.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Copy,
  X,
  ShieldOff,
  Clock,
  Loader2,
  QrCode,
  Send,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatBytes } from "@/lib/utils";
import { useCountdown } from "@/hooks/use-countdown";
import type { SharePageData } from "@/types";

interface Props {
  shareId: string;
  file: SharePageData;
}

export function SharePageClient({ shareId, file }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const countdown = useCountdown(file.expiresAt);

  const handleDownload = () => {
    setDownloading(true);
    window.location.href = `/api/files/${shareId}/download`;
    setTimeout(() => setDownloading(false), 3000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/f/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    try {
      const res = await fetch(`/api/files/${shareId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Email sent successfully!");
        setShowEmailForm(false);
        setEmail("");
      } else {
        const { error } = await res.json();
        toast.error(error || "Failed to send email.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSending(false);
    }
  };

  if (file.isExpired || countdown.expired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full border border-border rounded-lg p-10 flex flex-col items-center gap-5 text-center"
      >
        <div className="w-12 h-12 rounded-lg border border-border flex items-center justify-center">
          <X className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-foreground">File expired</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This file was auto-deleted. Temp File links expire to protect your privacy.
          </p>
        </div>
        <a
          href="/"
          className="h-9 px-4 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
        >
          Share a new file
        </a>
      </motion.div>
    );
  }

  const downloadsLeft =
    file.maxDownloads !== null
      ? Math.max(0, file.maxDownloads - file.downloadCount)
      : null;
  const limitReached = downloadsLeft !== null && downloadsLeft === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-md w-full"
    >
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center bg-muted/20 shrink-0">
              <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate" title={file.filename}>
                {file.filename}
              </p>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                {formatBytes(file.size)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 border border-border rounded-sm px-2 py-1">
              <Clock className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">
                <span className="text-foreground font-semibold tabular-nums">{countdown.display}</span>
              </span>
            </div>
            {downloadsLeft !== null && (
              <div className="border border-border rounded-sm px-2 py-1">
                <span className="font-mono text-[10px] text-muted-foreground">
                  <span className={`font-semibold tabular-nums ${downloadsLeft === 0 ? "text-muted-foreground" : "text-foreground"}`}>
                    {downloadsLeft}
                  </span>{" "}left
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 border border-border rounded-sm px-2 py-1">
              <ShieldOff className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground">No tracking</span>
            </div>
            <div className="border border-border rounded-sm px-2 py-1">
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {file.downloadCount} download{file.downloadCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {limitReached ? (
            <div className="w-full h-11 border border-border rounded-md flex items-center justify-center">
              <span className="text-sm text-muted-foreground font-mono">Download limit reached</span>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full h-11 text-sm font-mono bg-foreground text-background rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Preparing download…</>
              ) : (
                <><Download className="h-4 w-4" />Download <span className="max-w-[160px] truncate">{file.filename}</span></>
              )}
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 h-9 text-xs font-mono border border-border text-foreground rounded-md flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            >
              <Copy className="h-3 w-3" />Copy link
            </button>
            <button
              onClick={() => toast("QR code coming soon", { icon: "📱" })}
              className="h-9 w-9 flex items-center justify-center border border-border text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors"
              title="Show QR code"
            >
              <QrCode className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowEmailForm(true)}
              className="h-9 w-9 flex items-center justify-center border border-border text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors"
              title="Share via Email"
            >
              <Mail className="h-4 w-4" />
            </button>
          </div>

          {showEmailForm && (
            <form
              onSubmit={handleEmailSend}
              className="flex gap-2 p-3 border border-border rounded-md bg-muted/30"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Recipient's email..."
                className="flex-1 h-9 px-3 text-xs bg-transparent border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="h-9 w-9 flex items-center justify-center bg-foreground text-background rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-border px-6 py-3 flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted-foreground">
            Powered by <a href="/" className="text-foreground hover:underline underline-offset-2">Temp File</a>
          </p>
          <a href="/" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            Share your own →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
