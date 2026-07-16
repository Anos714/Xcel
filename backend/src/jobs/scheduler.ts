import { automationQueue } from "../queues/automation.queue";
import { postingQueue } from "../queues/posting.queue";
import { db } from "../db";
import { settings } from "../db/schema";
import { createDefaultSetting } from "../services/settings.service";
import { logger } from "../lib/logger.js";

export const registerAutomationScheduler = async () => {
  await automationQueue.upsertJobScheduler(
    "daily-automation",
    {
      pattern: "0 0 * * *", // Every day at 12:00 AM
    },
    {
      name: "generate-daily-tweets",
      opts: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    }
  );

  logger.info("Automation scheduler registered");
};

export const registerPostingSchedulers = async () => {
  // Get posting times from settings
  const [appSettings] = await db.select().from(settings).limit(1);

  let generatedSettings=appSettings;
  if (!appSettings) {
   generatedSettings=await createDefaultSetting()
   logger.info("Default settings created");
    
  }

  // Remove previous schedulers
  await removePostingSchedulers();

  for (const [index, time] of generatedSettings!.postingTimes.entries()) {
    const [hour, minute] = time.split(":");

    await postingQueue.upsertJobScheduler(
      `posting-${index}`,
      {
        pattern: `${minute} ${hour} * * *`,
      },
      {
        name: "post-tweet",
      }
    );
  }

  logger.info("Posting schedulers registered");
};

export const removePostingSchedulers = async () => {
  // Max 15 posting times
  for (let i = 0; i < 15; i++) {
    try {
      await postingQueue.removeJobScheduler(`posting-${i}`);
    } catch {
    }
  }
};