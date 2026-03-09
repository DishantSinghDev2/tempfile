// src/components/dashboard/dashboard-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Upload,
  Files,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "next-auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/files", label: "Files", icon: Files },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface Props {
  user: User & { planTier?: string };
}

export function DashboardNav({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 border-r border-border bg-background z-50">
      {/* Logo */}
      <div className="h-14 border-b border-border flex items-center px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
            <Upload className="h-3 w-3 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">
            TempFile
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors",
                isActive
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? ""}
              className="w-7 h-7 rounded-md border border-border"
            />
          ) : (
            <div className="w-7 h-7 rounded-md border border-border bg-muted flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user.name}
            </p>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest border border-border rounded-sm px-1 py-px text-muted-foreground">
                {(user as { planTier?: string }).planTier ?? "free"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        >
          <LogOut className="h-3 w-3" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
