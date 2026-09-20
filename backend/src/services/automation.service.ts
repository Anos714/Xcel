import { tweets } from "./../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { queries } from "../db/schema.js";
import crypto from "crypto";
import { searchWeb } from "./tavily.service.js";
import { generateTweet, type TweetResponse } from "./gemini.service.js";
import AppError from "../utils/AppError.js";


export type AutomationTweet = {
  id: string;
  content: string;
  hashtags: string[] | null;
  query: string | null;
};

export type AutomationStreamEvent = {
  type: "phase" | "query" | "complete" | "error";
  step: string;
  label: string;
  detail?: string;
  status: "active" | "done" | "error";
  query?: string;
  tweet?: AutomationTweet;
  count?: number;
  message?: string;
};

export const runAutomation = async (
  onProgress?: (event: AutomationStreamEvent) => void,
): Promise<TweetResponse[]> => {
  const emit = (event: AutomationStreamEvent): void => {
    onProgress?.(event);
  };

  emit({
    type: "phase",
    step: "fetch-queries",
    label: "Fetching active queries",
    status: "active",
  });

  const activeQueries = await getActiveQueries();

  emit({
    type: "phase",
    step: "fetch-queries",
    label: "Fetching active queries",
    detail: `${activeQueries.length} active topic${activeQueries.length === 1 ? "" : "s"} found`,
    status: "done",
  });

  emit({
    type: "phase",
    step: "select-queries",
    label: "Selecting topics for this cycle",
    status: "active",
  });

  const randomQueries = pickRandomQueries(activeQueries);

  emit({
    type: "phase",
    step: "select-queries",
    label: "Selecting topics for this cycle",
    detail: `${randomQueries.length} topic${randomQueries.length === 1 ? "" : "s"} selected`,
    status: "done",
  });

  const results = await Promise.all(
    randomQueries.map(async (query) => {
      emit({
        type: "query",
        step: `search:${query}`,
        label: "Searching the web with Tavily",
        status: "active",
        query,
      });

      const searchResults = await searchWeb(query);

      emit({
        type: "query",
        step: `search:${query}`,
        label: "Web search complete",
        detail: `${searchResults.length} result${searchResults.length === 1 ? "" : "s"} found`,
        status: "done",
        query,
      });

      emit({
        type: "query",
        step: `generate:${query}`,
        label: "Generating tweet with Gemini",
        status: "active",
        query,
      });

      const tweet = await generateTweet(searchResults);

      emit({
        type: "query",
        step: `generate:${query}`,
        label: "Tweet generated",
        status: "done",
        query,
      });

      emit({
        type: "query",
        step: `save:${query}`,
        label: "Saving to pending queue",
        status: "active",
        query,
      });

      const savedTweet = await savePendingTweet(query, tweet);

      emit({
        type: "query",
        step: `save:${query}`,
        label: "Saved to pending queue",
        status: "done",
        query,
        tweet: {
          id: savedTweet.id,
          content: savedTweet.content,
          hashtags: savedTweet.hashtags,
          query: savedTweet.query,
        },
      });

      return tweet;
    }),
  );

  emit({
    type: "complete",
    step: "complete",
    label: "Automation complete",
    status: "done",
    count: results.length,
  });

  return results;
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
