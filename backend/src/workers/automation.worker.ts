import { Worker } from "bullmq";
import { redisClient } from "../config/redis";
import { runAutomation } from "../services/automation.service";
import { logger } from "../lib/logger";



export const automationWorker = new Worker(
  "automation",
  async (job) => {
    logger.info("Automation Worker Started");

    await runAutomation();

    logger.info("Automation Completed");
  },
  {
    connection: redisClient,
  },
);

automationWorker.on("completed", (job) => {
  logger.info(`Automation Job ${job.id} completed`);
});

automationWorker.on("failed", (job, err) => {
  logger.error(err,`Automation Job ${job?.id} failed` );
});