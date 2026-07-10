import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { runAutomation } from "../services/automation.service";

export const automation = async (req: Request, res: Response) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const response = await runAutomation(userId);

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
