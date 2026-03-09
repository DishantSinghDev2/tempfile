// src/lib/db/schema.ts
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  name: text("name"),
  image: text("image"),
  planTier: text("plan_tier", {
    enum: ["free", "pro", "starter", "enterprise"],
  })
    .notNull()
    .default("free"),
  creditsRemaining: integer("credits_remaining").notNull().default(0),
  creditsResetAt: integer("credits_reset_at", { mode: "timestamp_ms" }),
  activeStorageBytes: integer("active_storage_bytes").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const accounts = sqliteTable("accounts", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const files = sqliteTable(
  "files",
  {
    id: text("id").primaryKey(),
    shareId: text("share_id").notNull().unique(),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    filename: text("filename").notNull(),
    originalFilename: text("original_filename").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    sha256: text("sha256").notNull(),
    storageKey: text("storage_key").notNull(),
    storageTier: text("storage_tier", {
      enum: ["gcs_standard", "r2_hot", "gcs_nearline", "deleted"],
    })
      .notNull()
      .default("gcs_standard"),
    downloadCount: integer("download_count").notNull().default(0),
    maxDownloads: integer("max_downloads"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    uploaderIp: text("uploader_ip"),
    firstDownloaderIp: text("first_downloader_ip"),
    status: text("status", {
      enum: ["pending", "active", "expired", "deleted"],
    })
      .notNull()
      .default("pending"),
    passwordHash: text("password_hash"),
    isDeduped: integer("is_deduped", { mode: "boolean" })
      .notNull()
      .default(false),
    dedupedFromId: text("deduped_from_id"),
  },
  (table) => ({
    sha256Idx: index("files_sha256_idx").on(table.sha256),
    shareIdIdx: index("files_share_id_idx").on(table.shareId),
    userIdIdx: index("files_user_id_idx").on(table.userId),
    expiresAtIdx: index("files_expires_at_idx").on(table.expiresAt),
    statusIdx: index("files_status_idx").on(table.status),
  })
);

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  paddleSubscriptionId: text("paddle_subscription_id").notNull().unique(),
  paddleCustomerId: text("paddle_customer_id").notNull(),
  status: text("status", {
    enum: ["active", "canceled", "past_due", "trialing"],
  })
    .notNull()
    .default("active"),
  planTier: text("plan_tier", {
    enum: ["free", "pro", "starter", "enterprise"],
  })
    .notNull()
    .default("free"),
  currentPeriodEnd: integer("current_period_end", {
    mode: "timestamp_ms",
  }).notNull(),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" })
    .notNull()
    .default(false),
  paddlePriceId: text("paddle_price_id"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const creditTransactions = sqliteTable("credit_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  type: text("type", {
    enum: ["purchase", "monthly_reset", "upload_deduct", "refund"],
  }).notNull(),
  description: text("description"),
  fileId: text("file_id").references(() => files.id, { onDelete: "set null" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
