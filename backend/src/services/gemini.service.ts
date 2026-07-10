import { generateTweetPrompt } from "../prompts/generateTweet.prompt";
import { ai } from "../config/gemini";
import {
  formatSearchResults,
  type SearchResult,
} from "../utils/formatSearchResults";

export type TweetResponse = {
  tweetContent: string;
  hashtags: string[];
};

export const generateTweet = async (
  searchResults: SearchResult[],
): Promise<TweetResponse> => {
  try {
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
      throw new Error("Gemini returned an empty response");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(response.text);
    } catch {
      throw new Error("Invalid JSON returned by Gemini.");
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("tweetContent" in parsed) ||
      !("hashtags" in parsed)
    ) {
      throw new Error("Invalid response structure from Gemini.");
    }

    const result = parsed as TweetResponse;

    if (
      typeof result.tweetContent !== "string" ||
      !Array.isArray(result.hashtags)
    ) {
      throw new Error("Invalid response data types from Gemini.");
    }

    return result;
  } catch (error) {
    console.error("Error generating tweet:", error);
    throw error;
  }
};
