import type { ZodUUID } from "zod";
import { db } from "../db"
import { settings } from "../db/schema.js"
import { eq } from "drizzle-orm";


 const createDefaultSetting=async()=>{
    try {
        const [result]=await db.insert(settings).values({}).returning();
          if(!result){
            throw new Error("Error when creating default settings");
        }
        return result;
    } catch (error) {
         console.error("Database create error:", error);
    throw error; 
    }
}

export const getSettings=async()=>{
    try {

       
        const [result]=await db.select().from(settings)

        if(!result){
           const newSettings= await createDefaultSetting();
           return newSettings;
        }

       

        return result;
    } catch (error) {
         console.error("Database fetch error:", error);
    throw error; 
    }
}



export const updateSettings = async (
 
  updates: Partial<{
    automationEnabled?: boolean | null;
    postingTimes?: string[] | null;
    timezone?: string | null;
  }>
) => {
  try {
    const updateData: Record<string, any> = {};
    
    if (updates.automationEnabled !== undefined) updateData.automationEnabled = updates.automationEnabled;
    if (updates.postingTimes !== undefined) updateData.postingTimes = updates.postingTimes;
    if (updates.timezone !== undefined) updateData.timezone = updates.timezone;

    if (Object.keys(updateData).length === 0) {
      throw new Error("Update karne ke liye koi data nahi bhejaj gaya");
    }

    const currentSettings=await getSettings()

    const [result] = await db
      .update(settings)
      .set(updateData) 
      .where(eq(settings.id, currentSettings.id)) 
      .returning(); 

     if(!result){
    throw new Error("Settings not found")
}

    return result;
  } catch (error) {
    console.error("Database update error:", error);
    throw error; 
  }
};





export const settingService={getSettings,updateSettings}