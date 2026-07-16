import { z } from 'zod'

export const tweetSchema = z
  .object({
    content: z
      .string({ message: "Content is required" })
      .trim()
      .min(1, { message: "Content cannot be empty" }),

    hashtags: z.array(z.string().trim().min(1)).optional(),

    scheduledFor: z.coerce.date().optional(),

    postType: z.enum(["now", "scheduled"]),
  })
  .superRefine((data, ctx) => {
    // scheduled tweet validation
    if (data.postType === "scheduled") {
      if (!data.scheduledFor) {
        ctx.addIssue({
          code: "custom",
          path: ["scheduledFor"],
          message: "scheduledFor is required for scheduled posts",
        });
      } else if (data.scheduledFor.getTime() <= Date.now()) {
        ctx.addIssue({
          code: "custom",
          path: ["scheduledFor"],
          message: "scheduledFor must be a future date",
        });
      }
    }

    // now post shouldn't contain scheduledFor
    if (data.postType === "now" && data.scheduledFor) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduledFor"],
        message: "scheduledFor should not be provided for immediate posts",
      });
    }

    // Calculate final tweet length
    const hashtagText =
      data.hashtags?.length
        ? data.hashtags.map((tag) => `#${tag}`).join(" ")
        : "";

    const finalTweet =
      `${data.content}${hashtagText ? `\n${hashtagText}` : ""}`.trim();

    const limit = data.hashtags?.length ? 250 : 280;

    if (finalTweet.length > limit) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: `Tweet exceeds ${limit} characters.`,
      });
    }
  });
export type TweetInput=z.infer<typeof tweetSchema>;



export const enhanceTweetSchema=z.object({
     content: z.string({ message: "Content is required" }).max(250, { message: "Content must be under 250 character limit" }),
})

export const getTweetsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z
    .enum(["draft", "pending", "posted", "failed"])
    .optional(),

  type: z.enum(["automation", "custom"]).optional(),
});


export const updateTweetSchema = z
  .object({
    content: z
      .string()
      .min(1, "Content is required")
      .max(250, "Content must be under 250 characters")
      .optional(),

    hashtags: z.array(z.string()).nullable().optional(),

    scheduledFor: z.coerce.date().nullable().optional(),
  })
  .refine(
    (data) =>
      data.content !== undefined ||
      data.hashtags !== undefined ||
      data.scheduledFor !== undefined,
    {
      message: "At least one field is required to update.",
    }
  );

  export const tweetIdSchema = z.object({
  tweetId: z.uuidv7(),
});

