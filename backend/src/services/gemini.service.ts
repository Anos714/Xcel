import { generateTweetPrompt } from "../prompts/generateTweet.prompt";
import { ai } from "../config/gemini";
import {
  formatSearchResults,
  type SearchResult,
} from "../utils/formatSearchResults";
import AppError from "../utils/AppError";
import { logger } from "../lib/logger";

export type TweetResponse = {
  tweetContent: string;
  hashtags: string[];
};

const MODELS = [
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

const MAX_RETRIES = 2;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error: any): boolean => {
  const status = error?.status ?? error?.code ?? error?.response?.status;

  const message = String(error?.message ?? "").toLowerCase();

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("resource_exhausted") ||
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("high demand") ||
    message.includes("unavailable") ||
    message.includes("try again later")
  );
};

const generateWithModel = async (
  model: string,
  contents: string,
  config: any,
) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      logger.info(
        {
          model,
          attempt,
        },
        "Generating content with Gemini",
      );

      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      logger.info(
        {
          model,
          attempt,
        },
        "Gemini request succeeded",
      );

      return response;
    } catch (error: any) {
      lastError = error;

      logger.warn(
        {
          model,
          attempt,
          status: error?.status,
          message: error?.message,
        },
        "Gemini request failed",
      );

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt > MAX_RETRIES) {
        break;
      }

      const delay =
        Math.pow(2, attempt - 1) * 1000 + Math.floor(Math.random() * 500);

      logger.info(
        {
          model,
          nextAttempt: attempt + 1,
          delay,
        },
        "Retrying Gemini request",
      );

      await sleep(delay);
    }
  }

  throw lastError;
};

export async function generateContentWithFallback(
  contents: string,
  config: any,
) {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      return await generateWithModel(model, contents, config);
    } catch (error: any) {
      lastError = error;

      logger.warn(
        {
          model,
        },
        "Switching to next Gemini model",
      );
    }
  }

  logger.error(
    {
      error: lastError,
    },
    "All Gemini models failed",
  );

  if (lastError instanceof AppError) {
    throw lastError;
  }

  throw new AppError(
    "All Gemini models are currently unavailable. Please try again later.",
    503,
  );
}

export const generateTweet = async (
  searchResults: SearchResult[],
): Promise<TweetResponse> => {
  const formattedResults = formatSearchResults(searchResults);
  const prompt = generateTweetPrompt(formattedResults);
  const response = await generateContentWithFallback(prompt, {
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        tweetContent: {
          type: "string",
        },
        hashtags: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["tweetContent", "hashtags"],
    },
  });

  if (!response.text) {
    throw new AppError("Gemini returned an empty response", 502);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new AppError("Invalid JSON returned by Gemini.", 502);
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("tweetContent" in parsed) ||
    !("hashtags" in parsed)
  ) {
    throw new AppError("Invalid response structure from Gemini.", 502);
  }

  const result = parsed as TweetResponse;

  if (
    typeof result.tweetContent !== "string" ||
    !Array.isArray(result.hashtags)
  ) {
    throw new AppError("Invalid response data types from Gemini.", 502);
  }

  return result;
};
