import { automationQueue } from "../queues/automation.queue";
import { postingQueue } from "../queues/posting.queue";
import { db } from "../db";
import { settings } from "../db/schema";
import { createDefaultSetting } from "../services/settings.service";
import { logger } from "../lib/logger.js";

const getSchedulerId = (time: string) => {
  const [hour, minute] = time.split(":");
  return `automation-${hour}-${minute}`;
};

export const registerAutomationScheduler = async () => {
  const [appSettings] = await db.select().from(settings).limit(1);

  const generatedSettings = appSettings ?? (await createDefaultSetting());

  if (!appSettings) {
    logger.info("Default settings created");
  }

  const automationTimes = generatedSettings?.automationTimes;

  // Existing schedulers
  const existingSchedulers = await automationQueue.getJobSchedulers();

  const existingIds = new Set(
    existingSchedulers
      .map((scheduler) => scheduler.key)
      .filter((key) => key.startsWith("automation-")),
  );

  const newIds = new Set(automationTimes?.map((time) => getSchedulerId(time)));

  // Remove deleted schedulers
  for (const id of existingIds) {
    if (!newIds.has(id)) {
      await automationQueue.removeJobScheduler(id);
      logger.info(`Removed scheduler: ${id}`);
    }
  }

  // Add or update schedulers
  for (const time of automationTimes || []) {
    const [hour, minute] = time.split(":");

    await automationQueue.upsertJobScheduler(
      getSchedulerId(time),
      {
        pattern: `${minute} ${hour} * * *`,
        tz: generatedSettings?.timezone || "Asia/Kolkata",
      },
      {
        name: "generate-daily-tweets",
        opts: {
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      },
    );
    logger.info(`Registered scheduler: ${getSchedulerId(time)}`);
  }

  logger.info("Automation scheduler registered");
};

const getPostingSchedulerId = (time: string) => {
  const [hour, minute] = time.split(":");
  return `posting-${hour}-${minute}`;
};

export const registerPostingSchedulers = async () => {
  // Get posting times from settings
  const [appSettings] = await db.select().from(settings).limit(1);

  const generatedSettings = appSettings ?? (await createDefaultSetting());

  if (!appSettings) {
    logger.info("Default settings created");
  }

  const postingTimes = generatedSettings?.postingTimes;

  // Existing schedulers
  const existingSchedulers = await postingQueue.getJobSchedulers();

  const existingIds = new Set(
    existingSchedulers
      .map((scheduler) => scheduler.key)
      .filter((key) => key.startsWith("posting-")),
  );

  const newIds = new Set(
    postingTimes?.map((time) => getPostingSchedulerId(time)),
  );

  // Remove deleted schedulers
  for (const id of existingIds) {
    if (!newIds.has(id)) {
      await postingQueue.removeJobScheduler(id);
      logger.info(`Removed posting scheduler: ${id}`);
    }
  }

  for (const time of postingTimes || []) {
    const [hour, minute] = time.split(":");

    await postingQueue.upsertJobScheduler(
      getPostingSchedulerId(time),
      {
        pattern: `${minute} ${hour} * * *`,
        tz: generatedSettings?.timezone || "Asia/Kolkata",
      },
      {
        name: "post-tweet",
      },
    );
    logger.info(`Registered posting scheduler: ${getPostingSchedulerId(time)}`);
  }

  logger.info("Posting schedulers registered");
};
