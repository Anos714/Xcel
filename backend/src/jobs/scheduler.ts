import { automationQueue } from "../queues/automation.queue";
import { postingQueue } from "../queues/posting.queue";


export const registerAutomationScheduler = async () => {
  await automationQueue.upsertJobScheduler(
    "daily-automation",
    {
      pattern: "0 0 * * *",
    },
    {
      name: "generate-daily-tweets",
      opts: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    },
  );
};


export const registerPostingSchedulers = async () => {
  await postingQueue.upsertJobScheduler(
    "10-am-post",
    {
      pattern: "00 10 * * *",
    },
    {
      name: "post-tweet",
    },
  );

  await postingQueue.upsertJobScheduler(
    "2-pm-post",
    {
      pattern: "0 14 * * *",
    },
    {
      name: "post-tweet",
    },
  );

  await postingQueue.upsertJobScheduler(
    "6-pm-post",
    {
      pattern: "0 18 * * *",
    },
    {
      name: "post-tweet",
    },
  );

  await postingQueue.upsertJobScheduler(
    "10-pm-post",
    {
      pattern: "0 22 * * *",
    },
    {
      name: "post-tweet",
    },
  );
};


