import type { NextFunction, Request, Response } from "express";
import { tweetService } from "../services/tweet.service.js";
import {
  enhanceTweetSchema,
  getTweetsSchema,
  tweetIdSchema,
  tweetSchema,
  updateTweetSchema,
} from "../validators/tweet.validator.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/sendResponse.js";

type EnhanceTweetRes = {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    content: string;
  };
};

export const enhanceTweet = catchAsync(
  async (req: Request, res: Response<EnhanceTweetRes>, next: NextFunction) => {
    const result = enhanceTweetSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: JSON.stringify(result.error.flatten().fieldErrors),
      });
    }

    const { content } = result.data;

    const response = await tweetService.enhanceTweet(content);
    return sendResponse(res, 200, "Query enhanced successfully", response);
  },
);

type ScheduleTweetRes = {
  success: boolean;
  message: string;
  error?: string;
  data?: object;
};

export const createTweet = catchAsync(
  async (req: Request, res: Response<ScheduleTweetRes>, next: NextFunction) => {
    const result = tweetSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: JSON.stringify(result.error.flatten().fieldErrors),
      });
    }

    const { content, postType, hashtags, scheduledFor } = result.data;

    const tweet = await tweetService.createTweet(
      content,
      postType,
      hashtags,
      scheduledFor,
    );
    return sendResponse(res, 200, "Tweet created successfully", tweet);
  },
);

export const getTweetsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = getTweetsSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: JSON.stringify(result.error.flatten().fieldErrors),
      });
    }

    const query = result.data;
    const tweets = await tweetService.getTweets(
      query.page,
      query.limit,
      query.status,
      query.type,
    );

    return sendResponse(res, 200, "Tweets fetched successfully", tweets);
  },
);

export const updateTweetController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const paramResult = tweetIdSchema.safeParse(req.params);
    if (!paramResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: JSON.stringify(paramResult.error.flatten().fieldErrors),
      });
    }

    const bodyResult = updateTweetSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: JSON.stringify(bodyResult.error.flatten().fieldErrors),
      });
    }

    const body = bodyResult.data;
    const { tweetId } = paramResult.data;

    const tweet = await tweetService.updateTweet(tweetId, body);

    return sendResponse(res, 200, "Tweet updated successfully", tweet);
  },
);

export const deleteTweetController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = tweetIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
        error: JSON.stringify(result.error.flatten().fieldErrors),
      });
    }

    const { tweetId } = result.data;

    const response = await tweetService.deleteTweet(tweetId);

    return sendResponse(res, 200, "Tweet deleted successfully", response);
  },
);
