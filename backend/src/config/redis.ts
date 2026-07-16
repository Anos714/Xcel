import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../lib/logger";

export const redisClient = new Redis(env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null,
  
});



redisClient.on("connect", () => {
  logger.info("Redis connected");
});

redisClient.on("ready", () => {
 logger.info("Redis client is ready and connected!");
});

redisClient.on("error", (err) => {
  logger.info(err,"Redis connection error");
});

redisClient.on("close", () => {
  logger.info("Redis connection closed");
});

redisClient.on("reconnecting", () => {
  logger.info("Redis reconnecting...");
});
