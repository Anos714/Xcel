import { tvly } from "../config/tavily";
import AppError from "../utils/AppError";

export const searchWeb = async (query: string) => {
 
    const response = await tvly.search(query, {
      maxResults: 3,
      searchDepth: "advanced",
    });

   if (!response.results || !response.results.length) {
    throw new AppError("Tavily didn't find any results for this query", 404);
  }

    return response.results;

};
