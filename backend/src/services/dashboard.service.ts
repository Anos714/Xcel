import { and, asc, count, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "../db";
import { queries, tweets } from "../db/schema.js";

export const getDashboardInfo = async () => {

 
        
    
  const [
   [{ totalTweets } = { totalTweets: 0 }],
  [{ pendingTweets } = { pendingTweets: 0 }],
  [{ postedTweets } = { postedTweets: 0 }],
  [{ failedTweets } = { failedTweets: 0 }],
  [{ activeQueries } = { activeQueries: 0 }],
    recentTweets,
    upcomingTweets,
  ] = await Promise.all([
    db
      .select({
        totalTweets: count(),
      })
      .from(tweets),

    db
      .select({
        pendingTweets: count(),
      })
      .from(tweets)
      .where(eq(tweets.status, "pending")),

    db
      .select({
        postedTweets: count(),
      })
      .from(tweets)
      .where(eq(tweets.status, "posted")),

    db
      .select({
        failedTweets: count(),
      })
      .from(tweets)
      .where(eq(tweets.status, "failed")),

    db
      .select({
        activeQueries: count(),
      })
      .from(queries)
      .where(eq(queries.active, true)),

    db
      .select({
        id: tweets.id,
        content: tweets.content,
        status: tweets.status,
        createdAt: tweets.createdAt,
      })
      .from(tweets)
      .orderBy(desc(tweets.createdAt))
      .limit(5),

    db
      .select({
        id: tweets.id,
        content: tweets.content,
        scheduledFor: tweets.scheduledFor,
        status: tweets.status,
      })
      .from(tweets)
      .where(
        and(
          eq(tweets.status, "pending"),
          isNotNull(tweets.scheduledFor)
        )
      )
      .orderBy(asc(tweets.scheduledFor))
      .limit(5),
  ]);

  return {
    stats: {
      totalTweets,
      pendingTweets,
      postedTweets,
      failedTweets,
      activeQueries,
    },
    recentTweets,
    upcomingTweets,
  };

};

export const dashboardService={getDashboardInfo}