import { z } from "zod";

export const updateSettingsSchema = z.object({
    automationEnabled: z.boolean().optional(),
    postingTimes: z.array(z.string()).optional(), 
    timezone: z.string().optional()               
}).refine(
    (data) => {
       
        return (
            data.automationEnabled !== undefined || 
            data.postingTimes !== undefined || 
            data.timezone !== undefined
        );
    },
    {
        message: "Automation enabled, posting times, ya timezone me se koi ek field bhejna zaroori hai",
        path: ["automationEnabled"] 
    }
);

