// src/app/not-found.tsx
import Link from "next/link";
import { Upload } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
      <div className="text-center space-y-6 max-w-sm">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-foreground rounded-md flex items-center justify-center">
            <Upload className="h-6 w-6 text-background" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist. It may have been moved or
            deleted.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="h-9 px-4 text-xs font-mono bg-foreground text-background rounded-md flex items-center hover:opacity-90 transition-opacity"
          >
            Go home
          </Link>
          <Link
            href="/pricing"
            className="h-9 px-4 text-xs font-mono border border-border text-foreground rounded-md flex items-center hover:bg-muted transition-colors"
          >
            View pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
