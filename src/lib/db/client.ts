// src/lib/db/client.ts
import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export function getDb() {
  try {
    const ctx = getCloudflareContext();
    return drizzle(ctx.env.DB, { schema });
  } catch (err) {
    // Fallback or handle build time
    console.warn("getDb called outside of request context");
    throw err;
  }
}

export type DB = ReturnType<typeof getDb>;
export { schema };
