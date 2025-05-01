CREATE TABLE `budget` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`amount` real DEFAULT 0 NOT NULL,
	`theme_color` text DEFAULT '#E6E6E6' NOT NULL,
	`content_color` text DEFAULT '#F6F6F6' NOT NULL
);
