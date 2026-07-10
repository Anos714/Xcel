import { Worker } from "bullmq";
import { redisClient } from "../config/redis";

export const postingWorker = new Worker("posting", async () => {}, {
  connection: redisClient,
});
