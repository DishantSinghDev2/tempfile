// src/instrumentation.ts
// Called once when Next.js server initializes
// Used to hook up Cloudflare bindings in local development

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "development") {
    const { initOpenNextCloudflareForDev } = await import(
      "@opennextjs/cloudflare"
    );
    initOpenNextCloudflareForDev();
  }
}
