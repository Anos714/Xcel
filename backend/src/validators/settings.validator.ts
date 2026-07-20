import { z } from "zod";

export const updateSettingsSchema = z
  .object({
    automationEnabled: z.boolean().optional(),
    postingTimes: z.array(z.string()).optional(),
    automationTimes: z.array(z.string()).optional(),
    timezone: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        data.automationEnabled !== undefined ||
        data.postingTimes !== undefined ||
        data.timezone !== undefined ||
        data.automationTimes !== undefined
      );
    },
    {
      message: "At least one field must be provided",
      path: ["automationEnabled"],
    },
  );
