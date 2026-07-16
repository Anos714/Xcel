import type { NextFunction, Request, Response } from "express";
import { runAutomation } from "../services/automation.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/sendResponse.js";

export const automation = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
 

    const response = await runAutomation();

   return sendResponse(
        res, 
        200, 
        "Automation completed successfully", 
        response
    );

    

});
