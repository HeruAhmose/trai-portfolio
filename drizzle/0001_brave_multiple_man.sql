CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`inquiryType` enum('collaboration','partnership','research','technical','general') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','read','responded','archived') NOT NULL DEFAULT 'new',
	`notificationSent` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailOnCaseStudyView` int NOT NULL DEFAULT 1,
	`emailOnPatentView` int NOT NULL DEFAULT 1,
	`emailOnSectionVisit` int NOT NULL DEFAULT 0,
	`emailOnInquiry` int NOT NULL DEFAULT 1,
	`emailOnCollaboration` int NOT NULL DEFAULT 1,
	`dailyDigest` int NOT NULL DEFAULT 1,
	`weeklyReport` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificationPreferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timelineEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('cybersecurity','materials','community','research','patent','publication','milestone') NOT NULL,
	`eventDate` timestamp NOT NULL,
	`year` int NOT NULL,
	`impact` text,
	`metrics` json,
	`relatedCaseStudyId` varchar(64),
	`relatedPatentId` varchar(64),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timelineEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `visitorEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`eventType` enum('page_view','case_study_view','patent_claim_view','section_visit','hk_assistant_query','contact_inquiry','collaboration_request','download_preprint') NOT NULL,
	`section` varchar(64),
	`details` json,
	`userAgent` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitorEvents_id` PRIMARY KEY(`id`)
);
