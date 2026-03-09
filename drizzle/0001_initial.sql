-- drizzle/0001_initial.sql
-- TempFile initial database schema
-- Run with: wrangler d1 migrations apply tempfile-db [--local|--remote]

CREATE TABLE IF NOT EXISTS `users` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL UNIQUE,
  `email_verified` integer,
  `name` text,
  `image` text,
  `plan_tier` text NOT NULL DEFAULT 'free',
  `credits_remaining` integer NOT NULL DEFAULT 0,
  `credits_reset_at` integer,
  `active_storage_bytes` integer NOT NULL DEFAULT 0,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `accounts` (
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `type` text NOT NULL,
  `provider` text NOT NULL,
  `provider_account_id` text NOT NULL,
  `refresh_token` text,
  `access_token` text,
  `expires_at` integer,
  `token_type` text,
  `scope` text,
  `id_token` text,
  `session_state` text
);

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_token` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `expires` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `verification_tokens` (
  `identifier` text NOT NULL,
  `token` text NOT NULL,
  `expires` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `files` (
  `id` text PRIMARY KEY NOT NULL,
  `share_id` text NOT NULL UNIQUE,
  `user_id` text REFERENCES `users`(`id`) ON DELETE SET NULL,
  `filename` text NOT NULL,
  `original_filename` text NOT NULL,
  `mime_type` text NOT NULL,
  `size` integer NOT NULL,
  `sha256` text NOT NULL,
  `storage_key` text NOT NULL,
  `storage_tier` text NOT NULL DEFAULT 'gcs_standard',
  `download_count` integer NOT NULL DEFAULT 0,
  `max_downloads` integer,
  `expires_at` integer NOT NULL,
  `deleted_at` integer,
  `created_at` integer NOT NULL,
  `uploader_ip` text,
  `first_downloader_ip` text,
  `status` text NOT NULL DEFAULT 'pending',
  `password_hash` text,
  `is_deduped` integer NOT NULL DEFAULT 0,
  `deduped_from_id` text
);

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `paddle_subscription_id` text NOT NULL UNIQUE,
  `paddle_customer_id` text NOT NULL,
  `status` text NOT NULL DEFAULT 'active',
  `plan_tier` text NOT NULL DEFAULT 'free',
  `current_period_end` integer NOT NULL,
  `cancel_at_period_end` integer NOT NULL DEFAULT 0,
  `paddle_price_id` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `credit_transactions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `amount` integer NOT NULL,
  `type` text NOT NULL,
  `description` text,
  `file_id` text REFERENCES `files`(`id`) ON DELETE SET NULL,
  `created_at` integer NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS `files_sha256_idx` ON `files`(`sha256`);
CREATE INDEX IF NOT EXISTS `files_share_id_idx` ON `files`(`share_id`);
CREATE INDEX IF NOT EXISTS `files_user_id_idx` ON `files`(`user_id`);
CREATE INDEX IF NOT EXISTS `files_expires_at_idx` ON `files`(`expires_at`);
CREATE INDEX IF NOT EXISTS `files_status_idx` ON `files`(`status`);
CREATE INDEX IF NOT EXISTS `sessions_user_id_idx` ON `sessions`(`user_id`);
CREATE INDEX IF NOT EXISTS `accounts_user_id_idx` ON `accounts`(`user_id`);
CREATE INDEX IF NOT EXISTS `subscriptions_user_id_idx` ON `subscriptions`(`user_id`);
