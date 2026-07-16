import { tweets } from "./../db/schema.js";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { queries } from "../db/schema.js";
import crypto from "crypto";
import { searchWeb } from "./tavily.service.js";
import { generateTweet, type TweetResponse } from "./gemini.service.js";
import AppError from "../utils/AppError.js";


export const runAutomation = async () => {
 
    const activeQueries = await getActiveQueries();
    const randomQueries = pickRandomQueries(activeQueries);

    let generatedTweets: TweetResponse[] = [];

    for (const query of randomQueries) {
      const searchResults = await searchWeb(query);
      

      const tweet = await generateTweet(searchResults);
      

      await savePendingTweet( query, tweet);

      generatedTweets.push(tweet);
    }

    

    return generatedTweets;

};

export const getActiveQueries = async (): Promise<string[]> => {
  
    const activeQueries = await db
      .select()
      .from(queries)
      .where(eq(queries.active, true));

    if (activeQueries.length === 0) {
      throw new AppError("No active queries found",404);
    }

    const data: string[] = activeQueries.map((aq) => aq.query);

    return data;
  
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

      if(!savedTweet){
        throw new AppError("Error while saving tweet",500)
      }

    return savedTweet;
 
};
