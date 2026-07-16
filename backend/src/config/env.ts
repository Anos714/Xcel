import { z } from "zod";
import "dotenv/config";
import { logger } from "../lib/logger";

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.string().default("development"),

  DATABASE_URL: z.string().url(),

  UPSTASH_REDIS_URL: z.string().url(),
  TAVILY_API_KEY: z.string(),
  GEMINI_API_KEY: z.string(),
  BUFFER_ACCESS_TOKEN: z.string(),
  BUFFER_CHANNEL_ID: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_USER_ID:z.string()
});

const envParse = envSchema.safeParse(process.env);
if (!envParse.success) {
  logger.error(envParse.error.issues,"Error parsing environment variables");
  process.exit(1);
}

export const env = envParse.data;
