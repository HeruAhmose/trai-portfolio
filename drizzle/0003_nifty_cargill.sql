CREATE TABLE `conversationMemory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`sentiment` varchar(32),
	`topics` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversationMemory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(128),
	`type` enum('achievement','milestone','system','engagement','ai_insight') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`data` json,
	`isRead` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128),
	`query` varchar(500) NOT NULL,
	`resultsCount` int NOT NULL DEFAULT 0,
	`clickedResultId` varchar(128),
	`clickedResultType` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`points` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`badges` json,
	`achievements` json,
	`weeklyPoints` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPoints_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPoints_sessionId_unique` UNIQUE(`sessionId`)
);
