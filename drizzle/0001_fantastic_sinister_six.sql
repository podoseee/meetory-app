CREATE TABLE `aiSuggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chatRoomId` int NOT NULL,
	`suggestion` text NOT NULL,
	`interests` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiSuggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blockedUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`blockedUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blockedUsers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatRoomMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chatRoomId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`leftAt` timestamp,
	CONSTRAINT `chatRoomMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatRooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`interests` json NOT NULL,
	`location` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatRooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checkIns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`place` varchar(255) NOT NULL,
	`interest` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `checkIns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chatRoomId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`reportedUserId` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','reviewed','resolved') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`nickname` varchar(50) NOT NULL,
	`profileImage` text,
	`interests` json NOT NULL DEFAULT JSON_ARRAY(),
	`location` varchar(50) NOT NULL,
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `userProfiles_userId_unique` UNIQUE(`userId`)
);
