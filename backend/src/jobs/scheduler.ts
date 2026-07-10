import { automationQueue } from "../queues/automation.queue";

export const registerAutomationScheduler = async (userId: string) => {
  await automationQueue.upsertJobScheduler(
    "daily-automation",
    {
      pattern: "0 0 * * *",
    },
    {
      name: "generate-daily-tweets",
      data: {
        userId,
      },
      opts: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    },
  );
};
