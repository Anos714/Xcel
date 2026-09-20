import type { NextFunction, Request, Response } from "express";
import { runAutomation } from "../services/automation.service.js";
import type { AutomationStreamEvent } from "../services/automation.service.js";
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

export const automationStream = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    if (typeof res.flushHeaders === "function") {
      res.flushHeaders();
    }

    let clientGone = false;

    req.on("close", () => {
      clientGone = true;
    });

    const send = (event: AutomationStreamEvent): void => {
      if (clientGone) return;

      try {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      } catch {
        clientGone = true;
      }
    };

    try {
      await runAutomation(send);
    } catch (error) {
      send({
        type: "error",
        step: "error",
        label: "Automation failed",
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Automation could not run. Please try again.",
      });
    } finally {
      if (!clientGone) {
        try {
          res.end();
        } catch {
          /* client already gone */
        }
      }
    }
  },
);
