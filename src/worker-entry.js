// src/worker-entry.js
import worker from "../.open-next/worker.js";

export default {
  async fetch(request, env, ctx) {
    return worker.fetch(request, env, ctx);
  },
  async scheduled(event, env, ctx) {
    if (!env.CRON_SECRET) {
      console.error("CRON_SECRET is not defined");
      return;
    }

    const appUrl = env.NEXT_PUBLIC_APP_URL || "http://localhost";
    const url = new URL("/api/cron/cleanup", appUrl);
    
    console.log(`Triggering cron: ${url.toString()}`);
    
    try {
      // Call the worker's own fetch handler internally
      const response = await worker.fetch(new Request(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.CRON_SECRET}`,
        },
      }), env, ctx);
      
      const result = await response.text();
      console.log(`Cron cleanup finished with status ${response.status}: ${result}`);
    } catch (error) {
      console.error("Cron cleanup failed:", error);
    }
  },
};
