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
  uniqueIndex,
  varchar,
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

    query: text("query").notNull(),

    active: boolean("active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  }
);

export const tweets = pgTable(
  "tweets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    content: text("content").notNull(),

    hashtags: text("hashtags").array(),

    query: varchar("query", { length: 255 }),
    type: tweetTypeEnum("type").notNull(),

    status: tweetStatusEnum("status").default("pending").notNull(),

    scheduledFor: timestamp("scheduled_for"),

    postedAt: timestamp("posted_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [

     index("tweets_status_idx").on(table.status),

     index("tweets_schedule_idx").on(table.scheduledFor),
  ],
);

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),

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
