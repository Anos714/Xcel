import { Worker } from "bullmq";
import { redisClient } from "../config/redis";
import { runAutomation } from "../services/automation.service";

type AutomationJob = {
  userId: string;
};

export const automationWorker = new Worker<AutomationJob>(
  "automation",
  async (job) => {
    console.log("Automation Worker Started");
    console.log(job.data);

    await runAutomation(job.data.userId);

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