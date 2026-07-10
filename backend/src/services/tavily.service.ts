import { tvly } from "../config/tavily";

export const searchWeb = async (query: string) => {
  try {
    const response = await tvly.search(query, {
      maxResults: 3,
      searchDepth: "advanced",
    });

    if (!response.results.length) {
      throw new Error("Tavily doesn't found any results");
    }

    return response.results;
  } catch (error) {
    console.error("Error fetching trends from Tavily:", error);
    throw error;
  }
};
