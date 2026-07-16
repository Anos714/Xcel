import { generateTweetPrompt } from "../prompts/generateTweet.prompt";
import { ai } from "../config/gemini";
import {
  formatSearchResults,
  type SearchResult,
} from "../utils/formatSearchResults";
import AppError from "../utils/AppError";

export type TweetResponse = {
  tweetContent: string;
  hashtags: string[];
};

export const generateTweet = async (
  searchResults: SearchResult[],
): Promise<TweetResponse> => {
 
    const formattedResults = formatSearchResults(searchResults);
    const prompt = generateTweetPrompt(formattedResults);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
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
      },
    });

    if (!response.text) {
      throw new AppError("Gemini returned an empty response",502);
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(response.text);
    } catch {
      throw new AppError("Invalid JSON returned by Gemini.",502);
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("tweetContent" in parsed) ||
      !("hashtags" in parsed)
    ) {
      throw new AppError("Invalid response structure from Gemini.",502);
    }

    const result = parsed as TweetResponse;

    if (
      typeof result.tweetContent !== "string" ||
      !Array.isArray(result.hashtags)
    ) {
      throw new AppError("Invalid response data types from Gemini.",502);
    }

    return result;
 
};
