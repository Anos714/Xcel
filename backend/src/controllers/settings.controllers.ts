import type { NextFunction, Request, Response } from "express";
import { settingService } from "../services/settings.service.js";
import {  updateSettingsSchema } from "../validators/settings.validator.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/sendResponse.js";

export const getSettings=catchAsync( async(req:Request,res:Response,next:NextFunction)=>{
   
        const response=await settingService.getSettings();

        return sendResponse(
    res, 
    200, 
    "Settings fetched successfully", 
    response 
);

  
})


export const updateSettings=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const bodyResult=updateSettingsSchema.safeParse(req.body);


    if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: JSON.stringify(bodyResult.error.flatten().fieldErrors,null,2),
    });
  }

  


  const data=bodyResult.data;


  
        const response=await settingService.updateSettings(data);

        return sendResponse(
    res, 
    200, 
    "Settings updated successfully", 
    response 
);
  
})