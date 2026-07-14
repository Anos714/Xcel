ALTER TABLE "tweets" DROP COLUMN "post_type";--> statement-breakpoint
ALTER TABLE "tweets" ALTER COLUMN "hashtags" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tweets" ALTER COLUMN "query" DROP NOT NULL;--> statement-breakpoint
DROP TYPE "post_type";