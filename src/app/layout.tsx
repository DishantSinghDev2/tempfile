// src/app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tempfile.io"),
  title: {
    default: "TempFile — Instant Secure File Sharing",
    template: "%s | TempFile",
  },
  description:
    "Share files instantly with auto-expiring links. No signup required. Upload up to 100MB free. Direct to CDN — zero proxy, zero latency. Built for developers, teams, and everyone in between.",
  keywords: [
    "file sharing",
    "temporary file hosting",
    "secure file transfer",
    "expiring links",
    "file upload",
    "developer API",
    "self-destructing files",
  ],
  openGraph: {
    type: "website",
    title: "TempFile — Instant Secure File Sharing",
    description:
      "Share files instantly with auto-expiring links. No signup required.",
    siteName: "TempFile",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TempFile — Instant Secure File Sharing",
    description: "Share files instantly with auto-expiring links.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "13px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
