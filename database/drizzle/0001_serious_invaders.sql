PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`onboarding` integer DEFAULT false,
	`currency` text DEFAULT 'PHP' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "onboarding", "currency") SELECT "id", "name", "onboarding", "currency" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;