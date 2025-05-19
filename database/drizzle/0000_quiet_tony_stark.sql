CREATE TABLE `budget` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`amount` real DEFAULT 0 NOT NULL,
	`theme_color` text DEFAULT '#E6E6E6' NOT NULL,
	`content_color` text DEFAULT '#F6F6F6' NOT NULL,
	`duration` text,
	`lastReset` text,
	`originalAmount` real
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_id` integer NOT NULL,
	`type` text NOT NULL,
	`amount` real DEFAULT 0 NOT NULL,
	`category` text NOT NULL,
	`title` text,
	`notes` text,
	`date` text NOT NULL,
	`created_at` text DEFAULT '2025-05-19T13:30:42.103Z' NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budget`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`onboarding` integer DEFAULT false,
	`currency` text DEFAULT 'PHP' NOT NULL
);
