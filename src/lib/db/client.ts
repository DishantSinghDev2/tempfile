// src/lib/db/client.ts
import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export function getDb() {
  const ctx = getCloudflareContext();
  return drizzle(ctx.env.DB, { schema });
}

export type DB = ReturnType<typeof getDb>;
export { schema };
