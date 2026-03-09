// src/components/layout/footer.tsx
import Link from "next/link";
import { Upload } from "lucide-react";

const links = {
  Product: [
    { label: "Pricing", href: "/pricing" },
    { label: "Playground", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Alternatives", href: "/alternatives" },
    { label: "Comparison", href: "/comparison" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/policies/privacy" },
    { label: "Terms of Service", href: "/policies/terms" },
    { label: "Refund Policy", href: "/policies/refund" },
    { label: "Copyright Policy", href: "/policies/copyright" },
    { label: "Compliance & Security", href: "/policies/compliance" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          {/* Brand */}
          <div className="space-y-4 max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
                <Upload className="h-3 w-3 text-background" strokeWidth={2.5} />
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">Temp File</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Instant, secure, ephemeral file sharing. Files auto-delete. No tracking.
              Built on Cloudflare and Google Cloud.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                GCS + Cloudflare R2
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                  {category}
                </p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Temp File. All rights reserved.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            Powered by Cloudflare Workers + GCS
          </p>
        </div>
      </div>
    </footer>
  );
}
