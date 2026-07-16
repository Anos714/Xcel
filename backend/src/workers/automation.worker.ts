import { Worker } from "bullmq";
import { redisClient } from "../config/redis";
import { runAutomation } from "../services/automation.service";



export const automationWorker = new Worker(
  "automation",
  async (job) => {
    console.log("Automation Worker Started");

    await runAutomation();

    console.log("Automation Completed");
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