import { Queue } from "bullmq";
import { redisClient } from "../config/redis.js";

export const postingQueue = new Queue("posting", { connection: redisClient });
