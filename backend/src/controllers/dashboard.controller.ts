import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";



export const getDashboardInfo=async(req:Request,res:Response)=>{
try {
    const response=await dashboardService.getDashboardInfo();

    return res.status(200).json({
        success:true,
        message:"dashboard info retrieved successfully",
        data:response
    })
} catch (error) {
    console.error("Error while getting dashboard info.",error);
    return res.status(500).json({
        success:false,
        message:"Internal Server error",
        error:error instanceof Error||"Something went wrong"
    })
    
}
}