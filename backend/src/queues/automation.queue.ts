import { Queue } from "bullmq";
import { redisClient } from "../config/redis.js";

export const automationQueue = new Queue("automation", { connection: redisClient });

