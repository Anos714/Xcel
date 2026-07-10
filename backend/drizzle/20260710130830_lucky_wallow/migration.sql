ALTER TABLE "tweets" ADD COLUMN "hashtags" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "tweets" ADD COLUMN "query" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "tweets" DROP COLUMN "source_links";