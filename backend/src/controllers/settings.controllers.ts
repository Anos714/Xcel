import type { Request, Response } from "express";
import { settingService } from "../services/settings.service";
import {  updateSettingsSchema } from "../validators/settings.validator.js";

export const getSettings=async(req:Request,res:Response)=>{
    try {
        const response=await settingService.getSettings();

        return res.status(200).json({
            success:true,
            message:"Settings fetched successfully",
            settings:response
        })
    } catch (error:unknown) {
    console.error("Error while getting settings:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error || "Something went wrong on the server",
    });
    }
}


export const updateSettings=async(req:Request,res:Response)=>{

    const bodyResult=updateSettingsSchema.safeParse(req.body);


    if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(bodyResult.error.flatten().fieldErrors,null,2),
    });
  }

  


  const data=bodyResult.data;


    try {
        const response=await settingService.updateSettings(data);

        return res.status(200).json({
            success:true,
            message:"Settings updated successfully",
            settings:response
        })
    } catch (error) {
       console.error("Error while updating setting", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
 error: error instanceof Error || "Something went wrong on the server",    });
    }
}