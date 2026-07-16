import type { NextFunction, Request, Response } from "express";
import { runAutomation } from "../services/automation.service";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const automation = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
 

    const response = await runAutomation();

    return res.status(200).json({
      success: true,
      message: "Automation completed successfully",
      data: response,
    });

    

});
