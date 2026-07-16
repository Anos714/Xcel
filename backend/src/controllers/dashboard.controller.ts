import type { NextFunction, Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/sendResponse.js";



export const getDashboardInfo=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const response=await dashboardService.getDashboardInfo();

   return sendResponse(
    res, 
    200, 
    "dashboard info retrieved successfully", 
    response
);


})