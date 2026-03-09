// src/types/next-auth.d.ts
import "next-auth";
import type { PlanTier } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      planTier?: PlanTier;
    };
  }

  interface User {
    planTier?: PlanTier;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    planTier?: PlanTier;
  }
}
