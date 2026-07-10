import { Worker } from "bullmq";
import { redisClient } from "../config/redis";
import { runAutomation } from "../services/automation.service";

type AutomationJob = {
  userId: string;
};

export const automationWorker = new Worker<AutomationJob>(
  "automation",
  async (job) => {
    await runAutomation(job.data.userId);
  },
  {
    connection: redisClient,
  },
);

automationWorker.on("completed", (job) => {
  console.log(`Automation Job ${job.id} completed`);
});

automationWorker.on("failed", (job, err) => {
  console.error(`Automation Job ${job?.id} failed`, err);
});
