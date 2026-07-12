import { Worker } from "bullmq";
import { redisClient } from "../config/redis";
import { db } from "../db";
import { tweets } from "../db/schema";
import { and, eq, asc } from "drizzle-orm";
import { postTweet } from "../services/buffer.service";

export const postingWorker = new Worker(
  "posting",
  async () => {
      console.log("Posting Worker Started");
    const pendingTweet = await db
      .select()
      .from(tweets)
      .where(and(eq(tweets.status, "pending"), eq(tweets.type, "automation")))
      .orderBy(asc(tweets.createdAt))
      .limit(1);

    if (pendingTweet.length === 0) {
      console.log("No pending tweets found");
      return;
    }

    const tweet = pendingTweet[0];

  

    if (!tweet) {
      console.log("No tweet found");
      return;
    }

    try{
         console.log("📝 Posting Tweet:", tweet.content);


    const bufferResponse = await postTweet(tweet.content,tweet.hashtags);

      console.log("📤 Buffer Response:", bufferResponse);

    await db
      .update(tweets)
      .set({
        status: "posted",
        postedAt: new Date(),
      })
      .where(eq(tweets.id, tweet.id));

       console.log("✅ Tweet Posted");

    return {
      success: true,
      tweetId: tweet.id,
    };
  } catch (error) {
    console.error("Posting worker error:", error);

    await db
      .update(tweets)
      .set({
        status: "failed",
      })
      .where(eq(tweets.id, tweet.id));

    return {
      success: false,
      tweetId: tweet.id,
    };
  }
  },
  {
    connection: redisClient,
  },
);

postingWorker.on("completed", (job) => {
  console.log(`Posting job ${job.id} completed`);
});

postingWorker.on("failed", (job, error) => {
  console.error(`Posting job ${job?.id} failed`, error);
});
