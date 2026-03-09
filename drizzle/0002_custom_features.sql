-- drizzle/0002_custom_features.sql

-- Add default_customization to users
ALTER TABLE `users` ADD COLUMN `default_customization` text;

-- Create file_customizations table
CREATE TABLE IF NOT EXISTS `file_customizations` (
	`id` text PRIMARY KEY NOT NULL,
	`file_id` text NOT NULL REFERENCES `files`(`id`) ON DELETE CASCADE,
	`theme` text,
	`donate_button_url` text,
	`custom_text` text,
	`created_at` integer NOT NULL
);

-- Create file_forms table
CREATE TABLE IF NOT EXISTS `file_forms` (
	`id` text PRIMARY KEY NOT NULL,
	`file_id` text NOT NULL REFERENCES `files`(`id`) ON DELETE CASCADE,
	`title` text NOT NULL,
	`description` text,
	`fields` text NOT NULL,
	`required` integer NOT NULL DEFAULT 0,
	`show_at` text NOT NULL DEFAULT 'before',
	`created_at` integer NOT NULL
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS `form_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text NOT NULL REFERENCES `file_forms`(`id`) ON DELETE CASCADE,
	`file_id` text NOT NULL REFERENCES `files`(`id`) ON DELETE CASCADE,
	`data` text NOT NULL,
	`downloader_ip` text,
	`created_at` integer NOT NULL
);
