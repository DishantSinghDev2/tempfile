// src/app/(dashboard)/dashboard/settings/settings-client.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, LogOut, Trash2, Palette, Save, Loader2, Heart } from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  planTier: string;
  createdAt: string;
  defaultCustomization: string | null;
}

export function SettingsClient({ user }: { user: UserData }) {
  const { theme, setTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customization, setCustomization] = useState(() => {
    if (user.defaultCustomization) {
      return JSON.parse(user.defaultCustomization);
    } 
    return { donateButtonUrl: "", customText: "" };
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultCustomization: customization }),
      });
      if (res.ok) {
        toast.success("Global settings saved");
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      toast.success("Account deleted");
      signOut({ callbackUrl: "/" });
    } else {
      toast.error("Failed to delete account. Contact support.");
    }
  };

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="space-y-0">
      {/* Profile */}
      <section className="border-t border-border py-8">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          01 — Profile
        </h2>
        <div className="flex items-center gap-4 mb-6">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-12 h-12 rounded-lg border border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center font-mono font-bold text-lg text-muted-foreground">
              {user.name[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Account ID", value: user.id.slice(0, 16) + "..." },
            {
              label: "Plan",
              value: user.planTier.charAt(0).toUpperCase() + user.planTier.slice(1),
            },
            {
              label: "Member since",
              value: new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              }),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
            >
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-mono text-xs text-foreground tabular-nums">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section className="border-t border-border py-8">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          02 — Appearance
        </h2>
        <div className="flex gap-2">
          {themes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex items-center gap-2 h-9 px-3 text-xs font-mono rounded-md border transition-colors ${
                theme === id
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* API */}
      <section className="border-t border-border py-8">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          03 — API Access
        </h2>
        {user.planTier === "free" ? (
          <div className="rounded-lg bg-muted/20 border border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">
              API access requires a Pro or Enterprise plan.{" "}
              <a
                href="/dashboard/billing"
                className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
              >
                Upgrade →
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Use your session token to authenticate API requests. Rotate it
              from this page if compromised.
            </p>
            <button
              onClick={() =>
                toast.success("API key rotation coming soon")
              }
              className="h-8 px-3 text-xs font-mono border border-border text-foreground rounded-md hover:bg-muted transition-colors"
            >
              Generate API key
            </button>
          </div>
        )}
      </section>

      {/* Sign out */}
      <section className="border-t border-border py-8">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          04 — Session
        </h2>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 h-8 px-3 text-xs font-mono border border-border text-foreground rounded-md hover:bg-muted transition-colors"
        >
          <LogOut className="h-3 w-3" />
          Sign out
        </button>
      </section>

      {user.planTier !== "free" && (
        <section className="border-t border-border py-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
            05 — Global Download Page
          </h2>
          <div className="space-y-6 max-w-sm">
            <p className="text-xs text-muted-foreground">
              Set default styles and a donate link that apply to all your file pages. You can override these on a per-file basis.
            </p>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                <Heart className="h-2 w-2" /> Default Donate URL
              </label>
              <input 
                value={customization.donateButtonUrl}
                onChange={(e) => setCustomization({ ...customization, donateButtonUrl: e.target.value })}
                placeholder="https://buymeacoffee.com/..."
                className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Default Custom Message</label>
              <textarea 
                value={customization.customText}
                onChange={(e) => setCustomization({ ...customization, customText: e.target.value })}
                placeholder="Thanks for downloading!"
                className="w-full h-20 p-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="h-9 px-4 flex items-center justify-center gap-2 text-xs font-mono bg-foreground text-background rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Global Settings
            </button>
          </div>
        </section>
      )}

      {/* Danger zone */}
      <section className="border-t border-border py-8">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          06 — Danger Zone
        </h2>
        {!showDeleteConfirm ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all associated data. This
              cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 h-8 px-3 text-xs font-mono border border-border text-foreground rounded-md hover:bg-muted transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Delete account
            </button>
          </div>
        ) : (
          <div className="rounded-lg bg-muted/20 border border-border p-4 space-y-4">
            <p className="text-xs text-foreground font-semibold">
              Are you absolutely sure?
            </p>
            <p className="text-xs text-muted-foreground">
              This will permanently delete your account, all files, and billing
              history. Active subscriptions will be cancelled.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                className="h-8 px-3 text-xs font-mono bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
              >
                Yes, delete everything
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="h-8 px-3 text-xs font-mono border border-border text-foreground rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="border-t border-border" />
    </div>
  );
}
