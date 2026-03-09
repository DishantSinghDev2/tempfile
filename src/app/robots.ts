// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/blog", "/policies"],
        disallow: ["/dashboard", "/api", "/f", "/auth"],
      },
    ],
    sitemap: "https://tempfile.io/sitemap.xml",
  };
}
