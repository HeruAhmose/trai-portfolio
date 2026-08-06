CREATE TABLE `themePreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`variant` enum('dark-cyberpunk','light-neon','high-contrast','minimal') NOT NULL DEFAULT 'dark-cyberpunk',
	`intensity` int NOT NULL DEFAULT 85,
	`glowIntensity` int NOT NULL DEFAULT 75,
	`animationSpeed` int NOT NULL DEFAULT 100,
	`accentColor` varchar(7) NOT NULL DEFAULT '#ff00ff',
	`presetName` varchar(255),
	`isDefault` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `themePreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `themePreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `themePresets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`variant` enum('dark-cyberpunk','light-neon','high-contrast','minimal') NOT NULL,
	`intensity` int NOT NULL,
	`glowIntensity` int NOT NULL,
	`animationSpeed` int NOT NULL,
	`accentColor` varchar(7) NOT NULL,
	`isPublic` int NOT NULL DEFAULT 0,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `themePresets_id` PRIMARY KEY(`id`)
);
