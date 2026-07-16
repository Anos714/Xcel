import { db } from "../db"
import { settings } from "../db/schema.js"
import { eq } from "drizzle-orm";
import { registerPostingSchedulers } from "../jobs/scheduler.js";
import AppError from "../utils/AppError.js";


 export const createDefaultSetting=async()=>{
   
        const [result]=await db.insert(settings).values({}).returning();
         
        return result;
  
}

export const getSettings=async()=>{
   

       
        const [result]=await db.select().from(settings)

        if(!result){
           const newSettings= await createDefaultSetting();
           return newSettings;
        }

       

        return result;
   
}



export const updateSettings = async (
 
  updates: Partial<{
    automationEnabled?: boolean | null;
    postingTimes?: string[] | null;
    timezone?: string | null;
  }>
) => {
 
    const updateData: Record<string, any> = {};
    
    if (updates.automationEnabled !== undefined) updateData.automationEnabled = updates.automationEnabled;
    if (updates.postingTimes !== undefined) updateData.postingTimes = updates.postingTimes;
    if (updates.timezone !== undefined) updateData.timezone = updates.timezone;

    if (Object.keys(updateData).length === 0) {
throw new AppError("No data provided for update", 400);
    }

    const currentSettings=await getSettings();
     if (!currentSettings) {
    throw new AppError("Failed to initialize or retrieve settings", 500);
  }

    const [result] = await db
      .update(settings)
      .set(updateData) 
      .where(eq(settings.id, currentSettings.id)) 
      .returning(); 

    

// Posting times changed
  if (updates.postingTimes !== undefined) {
    await registerPostingSchedulers();
  }

    return result;
 
};





export const settingService={getSettings,updateSettings}