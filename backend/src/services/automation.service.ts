import { tweets } from "./../db/schema.js";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { queries } from "../db/schema.js";
import crypto from "crypto";
import { searchWeb } from "./tavily.service.js";
import { generateTweet, type TweetResponse } from "./gemini.service.js";

export const runAutomation = async () => {
  try {
    const activeQueries = await getActiveQueries();
    const randomQueries = pickRandomQueries(activeQueries);

    let generatedTweets: TweetResponse[] = [];

    for (const query of randomQueries) {
      const searchResults = await searchWeb(query);
      console.log(searchResults);
      

      const tweet = await generateTweet(searchResults);
      console.log(tweet);
      

      await savePendingTweet( query, tweet);

      generatedTweets.push(tweet);
    }

    return generatedTweets;
  } catch (error) {
    console.error("Error running automation:", error);
    throw error;
  }
};

export const getActiveQueries = async (): Promise<string[]> => {
  try {
    const activeQueries = await db
      .select()
      .from(queries)
      .where(eq(queries.active, true));

    if (activeQueries.length === 0) {
      throw new Error("No active queries found");
    }

    const data: string[] = activeQueries.map((aq) => aq.query);

    return data;
  } catch (error) {
    console.error("Error fetching active queries:", error);
    throw error;
  }
};

export const pickRandomQueries = (queries: string[]): string[] => {
  if (queries.length <= 4) {
    return [...queries];
  }

  const shuffled = [...queries];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }

  return shuffled.slice(0, 4);
};

const savePendingTweet = async (
 
  query: string,
  tweet: TweetResponse,
) => {
  try {
    const [savedTweet] = await db
      .insert(tweets)
      .values({
        
        query,
        content: tweet.tweetContent,
        hashtags: tweet.hashtags,
        status: "pending",
        type: "automation",
      })
      .returning();

    return savedTweet;
  } catch (error) {
    console.error("Error saving pending tweet:", error);
    throw error;
  }
};
