import Redis from "ioredis";
import { env } from "./env";

export const redisClient = new Redis(env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready and connected!");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("close", () => {
  console.log("Redis connection closed");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});
