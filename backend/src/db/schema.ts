import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// enums
export const tweetTypeEnum = pgEnum("tweet_type", ["automation", "custom"]);

export const tweetStatusEnum = pgEnum("tweet_status", [
  "draft",
  "pending",
  "posted",
  "failed",
]);

export const queries = pgTable(
  "queries",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),

    clerkUserId: text("clerk_user_id").notNull(),

    query: text("query").notNull(),

    active: boolean("active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    clerkUserIdx: index("queries_clerk_user_idx").on(table.clerkUserId),
  }),
);

export const tweets = pgTable(
  "tweets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    clerkUserId: text("clerk_user_id").notNull(),

    content: text("content").notNull(),

    type: tweetTypeEnum("type").notNull(),

    status: tweetStatusEnum("status").default("pending").notNull(),

    sourceLinks: jsonb("source_links").$type<string[]>(),

    scheduledFor: timestamp("scheduled_for"),

    postedAt: timestamp("posted_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    clerkUserIdx: index("tweets_clerk_user_idx").on(table.clerkUserId),

    statusIdx: index("tweets_status_idx").on(table.status),

    scheduleIdx: index("tweets_schedule_idx").on(table.scheduledFor),
  }),
);

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),

  clerkUserId: text("clerk_user_id").notNull().unique(),

  automationEnabled: boolean("automation_enabled").default(true).notNull(),

  postingTimes: jsonb("posting_times")
    .$type<string[]>()
    .default(["10:00", "14:00", "18:00", "22:00"])
    .notNull(),

  timezone: text("timezone").default("Asia/Kolkata").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
