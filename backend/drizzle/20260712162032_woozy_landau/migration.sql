CREATE TYPE "post_type" AS ENUM('now', 'scheduled');--> statement-breakpoint
ALTER TABLE "tweets" ADD COLUMN "post_type" "post_type";