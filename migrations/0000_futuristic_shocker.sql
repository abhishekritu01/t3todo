CREATE TABLE `todo_todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(256),
	`description` text(256),
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`due_date` text(256),
	`completed` integer DEFAULT 0,
	`status` text(20) DEFAULT 'pending'
);
