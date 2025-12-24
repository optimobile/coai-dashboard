CREATE TABLE `analyst_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assignmentId` int NOT NULL,
	`analystId` int NOT NULL,
	`decision` enum('approve','reject','escalate','needs_more_info') NOT NULL,
	`confidence` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`reasoning` text NOT NULL,
	`evidenceReviewed` json,
	`timeSpentMinutes` int,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analyst_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analyst_performance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analystId` int NOT NULL,
	`totalCasesAssigned` int NOT NULL DEFAULT 0,
	`totalCasesCompleted` int NOT NULL DEFAULT 0,
	`totalCasesExpired` int NOT NULL DEFAULT 0,
	`accuracyRate` decimal(5,2),
	`avgResponseTimeMinutes` decimal(10,2),
	`qualityScore` decimal(5,2),
	`rank` int,
	`totalEarnings` decimal(10,2) NOT NULL DEFAULT '0.00',
	`lastActiveAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analyst_performance_id` PRIMARY KEY(`id`),
	CONSTRAINT `analyst_performance_analystId_unique` UNIQUE(`analystId`)
);
--> statement-breakpoint
CREATE TABLE `case_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analystId` int NOT NULL,
	`reportId` int NOT NULL,
	`councilSessionId` int,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('assigned','in_progress','completed','expired','reassigned') NOT NULL DEFAULT 'assigned',
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`dueAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `case_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certification_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`passingScore` int NOT NULL DEFAULT 70,
	`timeLimitMinutes` int NOT NULL DEFAULT 60,
	`totalQuestions` int NOT NULL DEFAULT 50,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certification_tests_id` PRIMARY KEY(`id`),
	CONSTRAINT `certification_tests_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `test_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`moduleId` int,
	`questionText` text NOT NULL,
	`questionType` enum('multiple_choice','true_false','scenario') NOT NULL DEFAULT 'multiple_choice',
	`options` json NOT NULL,
	`correctAnswer` varchar(255) NOT NULL,
	`explanation` text,
	`points` int NOT NULL DEFAULT 1,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `test_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`content` text NOT NULL,
	`orderIndex` int NOT NULL DEFAULT 0,
	`durationMinutes` int NOT NULL DEFAULT 30,
	`isRequired` boolean NOT NULL DEFAULT true,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `training_modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `training_modules_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `user_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`testId` int NOT NULL,
	`attemptId` int NOT NULL,
	`certificateNumber` varchar(100) NOT NULL,
	`certificateType` enum('basic','advanced','expert') NOT NULL DEFAULT 'basic',
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`isRevoked` boolean NOT NULL DEFAULT false,
	`revokedReason` text,
	CONSTRAINT `user_certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_certificates_certificateNumber_unique` UNIQUE(`certificateNumber`)
);
--> statement-breakpoint
CREATE TABLE `user_test_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`testId` int NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`totalPoints` int NOT NULL DEFAULT 0,
	`percentScore` decimal(5,2),
	`passed` boolean NOT NULL DEFAULT false,
	`answers` json,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_test_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_training_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`progressPercent` int NOT NULL DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_training_progress_id` PRIMARY KEY(`id`)
);
