import { and, count, desc, eq, } from "drizzle-orm";
import { ai } from "../config/gemini";
import { db } from "../db";
import { tweets } from "../db/schema";
import { enhanceTweetPrompt } from "../prompts/generateTweet.prompt";
import { postTweet } from "./buffer.service";
import { postingQueue } from "../queues/posting.queue";
import AppError from "../utils/AppError";

export type EnhanceTweetRes={
    content:string
}

export const enhanceTweet=async(content:string):Promise<EnhanceTweetRes>=>{
    
        const prompt = enhanceTweetPrompt(content);

         const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "object",
                  properties: {
                    content: {
                      type: "string",
                    },
                   
                  },
                  required: ["content"],
                },
              },
            });

             if (!response.text) {
                  throw new AppError("Gemini returned an empty response",502);
                }
            
                let parsed: unknown;
            
                try {
                  parsed = JSON.parse(response.text);
                } catch {
                  throw new AppError("Invalid JSON returned by Gemini",502);
                }
            
                if (
                  typeof parsed !== "object" ||
                  parsed === null ||
                  !("content" in parsed) 
                ) {
                  throw new AppError("Invalid response structure from Gemini",502);
                }
            
                const result = parsed as EnhanceTweetRes;
            
                if (
                  typeof result.content !== "string" 
                ) {
                  throw new AppError("Invalid response data types from Gemini.",502);
                }
            
                return result;
            
        
    
   

}


export const createTweet=async(content:string,postType:"now"|"scheduled",hashtags?:string[],scheduledFor?:Date)=>{



  const finalContent =
  hashtags?.length
    ? `${content}\n${hashtags.map(tag => `#${tag}`).join(" ")}`
    : content;
 const [tweet] = await db
  .insert(tweets)
  .values({
    content: finalContent,
    hashtags,
    type: "custom",
    status: "pending",
    scheduledFor: postType === "scheduled" ? scheduledFor : null,
  })
  .returning();

  if(!tweet){
    throw new AppError("Tweet creation failed",500)
  }

 const options =
  postType === "scheduled"
    ? {
        delay: scheduledFor!.getTime() - Date.now(),
      }
    : {
      jobId:tweet.id
    };

await postingQueue.add(
  "post-tweet",
  {
    tweetId: tweet.id,
  },
  options
);
  return tweet
  

}

export const getTweets = async (
  page: number,
  limit: number,
  status?: "draft" | "pending" | "posted" | "failed",
  type?: "automation" | "custom",
) => {
  const offset = (page - 1) * limit;

 

  let condition;

  if (status) {
     condition=eq(tweets.status, status)
  }

  if (type) {
     condition=eq(tweets.type, type);
  }

  const data = await db
    .select()
    .from(tweets)
    .where(condition)
    .orderBy(desc(tweets.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ total }={total:0}] = await db
    .select({
      total: count(),
    })
    .from(tweets)
    .where(and(condition));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(Number(total) / limit),
    },
  };
};

export const deleteTweet = async (
  
  tweetId: string
) => {
  const [tweet] = await db
    .select()
    .from(tweets)
    .where(
     eq(tweets.id, tweetId),
    )
    .limit(1);

  if (!tweet) {
    throw new AppError("Tweet not found.",404);
  }

  if (tweet.type !== "custom") {
    throw new AppError("Automation tweets cannot be deleted.",400);
  }

  if (tweet.status === "posted") {
    throw new AppError("Posted tweets cannot be deleted.",400);
  }

  // Remove scheduled/immediate pending job if it exists
  const job = await postingQueue.getJob(tweet.id);

  if (job) {
    await job.remove();
  }

  const [deletedTweet]=await db
    .delete(tweets)
    .where(eq(tweets.id, tweet.id)).returning();

  return deletedTweet;
};

export const updateTweet = async (
 
  tweetId: string,
  updates: Partial<{
    content: string;
    hashtags: string[] | null;
    scheduledFor: Date | null;
  }>
) => {
  const [tweet] = await db
    .select()
    .from(tweets)
    .where(
      eq(tweets.id, tweetId),
    )
    .limit(1);

  if (!tweet) {
    throw new Error("Tweet not found.");
  }

  if (tweet.type !== "custom") {
    throw new Error("Automation tweets cannot be updated.");
  }

  if (tweet.status !== "pending") {
    throw new Error("Only pending tweets can be updated.");
  }

  if (
    updates.scheduledFor &&
    updates.scheduledFor.getTime() <= Date.now()
  ) {
    throw new AppError("Scheduled time must be in the future.",400);
  }

  const content = updates.content ?? tweet.content;
  const hashtags = updates.hashtags ?? tweet.hashtags;
  const scheduledFor =
    updates.scheduledFor !== undefined
      ? updates.scheduledFor
      : tweet.scheduledFor;

  const finalContent =
    hashtags && hashtags.length > 0
      ? `${content}\n${hashtags.map((tag) => `#${tag}`).join(" ")}`
      : content;

  const [updatedTweet] = await db
    .update(tweets)
    .set({
      content: finalContent,
      hashtags,
      scheduledFor,
    })
    .where(eq(tweets.id, tweetId))
    .returning();

  // Reschedule only if scheduled time changed
  if (updates.scheduledFor !== undefined) {
    const oldJob = await postingQueue.getJob(tweet.id);

    if (oldJob) {
      await oldJob.remove();
    }

    if (scheduledFor) {
      const delay = scheduledFor.getTime() - Date.now();

      await postingQueue.add(
        "post-tweet",
        {
          tweetId: tweet.id,
        },
        {
          jobId: tweet.id,
          delay,
        }
      );
    }
  }

  return updatedTweet;
};

export const tweetService={enhanceTweet,createTweet,deleteTweet,updateTweet,getTweets}