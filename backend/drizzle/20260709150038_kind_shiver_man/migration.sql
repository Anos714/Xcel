CREATE TYPE "tweet_status" AS ENUM('draft', 'pending', 'posted', 'failed');--> statement-breakpoint
CREATE TYPE "tweet_type" AS ENUM('automation', 'custom');--> statement-breakpoint
CREATE TABLE "queries" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"clerk_user_id" text NOT NULL,
	"query" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_user_id" text NOT NULL UNIQUE,
	"automation_enabled" boolean DEFAULT true NOT NULL,
	"posting_times" jsonb DEFAULT '["10:00","14:00","18:00","22:00"]' NOT NULL,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tweets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_user_id" text NOT NULL,
	"content" text NOT NULL,
	"type" "tweet_type" NOT NULL,
	"status" "tweet_status" DEFAULT 'pending'::"tweet_status" NOT NULL,
	"source_links" jsonb,
	"scheduled_for" timestamp,
	"posted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "queries_clerk_user_idx" ON "queries" ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "tweets_clerk_user_idx" ON "tweets" ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "tweets_status_idx" ON "tweets" ("status");--> statement-breakpoint
CREATE INDEX "tweets_schedule_idx" ON "tweets" ("scheduled_for");