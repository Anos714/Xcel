import type { Request, Response } from "express";
import { runAutomation } from "../services/automation.service";

export const automation = async (req: Request, res: Response) => {
 
  try {
    const response = await runAutomation();

    return res.status(200).json({
      success: true,
      message: "Automation completed successfully",
      data: response,
    });
  } catch (error) {
    console.error("Automation controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to run automation",
    });
  }
};
