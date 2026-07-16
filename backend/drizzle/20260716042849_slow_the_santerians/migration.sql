ALTER TABLE "settings" DROP CONSTRAINT "settings_clerk_user_id_key";--> statement-breakpoint
DROP INDEX "queries_clerk_user_idx";--> statement-breakpoint
DROP INDEX "queries_user_query_unique";--> statement-breakpoint
DROP INDEX "tweets_clerk_user_idx";--> statement-breakpoint
ALTER TABLE "queries" DROP COLUMN "clerk_user_id";--> statement-breakpoint
ALTER TABLE "settings" DROP COLUMN "clerk_user_id";--> statement-breakpoint
ALTER TABLE "tweets" DROP COLUMN "clerk_user_id";--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "id" SET DEFAULT uuidv7();--> statement-breakpoint
ALTER TABLE "tweets" ALTER COLUMN "id" SET DEFAULT uuidv7();--> statement-breakpoint
CREATE UNIQUE INDEX "queries_query_unique" ON "queries" ("query");