PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_id` integer NOT NULL,
	`type` text NOT NULL,
	`amount` real DEFAULT 0 NOT NULL,
	`category` text NOT NULL,
	`title` text,
	`notes` text,
	`date` text NOT NULL,
	`created_at` text DEFAULT '2025-05-07T13:15:08.293Z' NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budget`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "budget_id", "type", "amount", "category", "title", "notes", "date", "created_at") SELECT "id", "budget_id", "type", "amount", "category", "title", "notes", "date", "created_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `budget` ADD `content_color` text DEFAULT '#F6F6F6' NOT NULL;