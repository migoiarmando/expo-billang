CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`onboarding` integer DEFAULT false,
	`name` text NOT NULL
);
