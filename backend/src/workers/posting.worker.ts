import { Worker } from "bullmq";
import { redisClient } from "../config/redis";
import { db } from "../db";
import { tweets } from "../db/schema";
import { and, asc, eq } from "drizzle-orm";
import { postTweet } from "../services/buffer.service";
import { logger } from "../lib/logger";

type PostingJob = {
  tweetId?: string;
};

export const postingWorker = new Worker<PostingJob>(
  "posting",
  async (job) => {
    logger.info("Posting Worker Started");

    let tweet;

    //manual flow
    if (job.data?.tweetId) {
      logger.info("Manual Tweet");

      const [result] = await db
        .select()
        .from(tweets)
        .where(eq(tweets.id, job.data.tweetId))
        .limit(1);

      tweet = result;
    }

    //automation flow
    else {
      logger.info("Automation Tweet");

      const [result] = await db
        .select()
        .from(tweets)
        .where(and(eq(tweets.status, "pending"), eq(tweets.type, "automation")))
        .orderBy(asc(tweets.createdAt))
        .limit(1);

      tweet = result;
    }

    if (!tweet) {
      logger.info("No tweet found");
      return;
    }

    try {
      logger.info({ content: tweet.content }, "Posting Tweet");

      const bufferResponse = await postTweet(
        tweet.content,
        tweet.hashtags ?? [],
      );

      logger.info({ bufferResponse: bufferResponse }, "Buffer Response");

      await db
        .update(tweets)
        .set({
          status: "posted",
          postedAt: new Date(),
        })
        .where(eq(tweets.id, tweet.id));

      logger.info("Tweet Posted");

      return {
        success: true,
        tweetId: tweet.id,
      };
    } catch (error) {
      logger.error(error, "Posting Error");

      await db
        .update(tweets)
        .set({
          status: "failed",
        })
        .where(eq(tweets.id, tweet.id));

      throw error;
    }
  },
  {
    connection: redisClient,
  },
);

postingWorker.on("completed", (job) => {
  logger.info(`Posting Job ${job.id} completed`);
});

postingWorker.on("failed", (job, err) => {
  logger.error(err, `Posting Job ${job?.id} failed`);
});
