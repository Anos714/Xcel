import { tavily } from "@tavily/core";
import { env } from "./env.js";

export const tvly = tavily({ apiKey: env.TAVILY_API_KEY });
