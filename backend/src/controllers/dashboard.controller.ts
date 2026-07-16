import type { NextFunction, Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";
import { catchAsync } from "../utils/catchAsync.js";



export const getDashboardInfo=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const response=await dashboardService.getDashboardInfo();

    return res.status(200).json({
        success:true,
        message:"dashboard info retrieved successfully",
        data:response
    })

})