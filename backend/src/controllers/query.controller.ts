import type { Request, Response } from "express";
import {
  paramsSchema,
  querySchema,
  updateQuerySchema,
} from "../validators/query.validator";
import { queryService } from "../services/query.service";




export const createQuery = async (req: Request, res: Response) => {
  const bodyResult = querySchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: bodyResult.error.flatten().fieldErrors,
    });
  }

  const { query } = bodyResult.data;
  
  

  try {
    const response = await queryService.createQuery(query);
   

    return res.status(201).json({
      success: true,
      message: "Query created successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getQueries = async (req: Request, res: Response) => {
 
  try {
    const response = await queryService.getQueries();
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch queries",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Queries fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Internal server error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const updateQuery = async (req: Request, res: Response) => {
  const paramResult = paramsSchema.safeParse(req.params);
  const bodyResult = updateQuerySchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL parameters",
      error: JSON.stringify(bodyResult.error.flatten().fieldErrors,null,2),
    });
  }

  if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL parameters",
      error: paramResult.error.flatten().fieldErrors,
    });
  }

  const { id: queryId } = paramResult.data;
  const { active } = bodyResult.data;

 
  try {
    const response = await queryService.updateQuery(queryId,  active);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Failed to update query",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Query updated successfully",
      data: response,
    });
  } catch (error) {
    console.error("Internal server error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const deleteQuery = async (req: Request, res: Response) => {
  const paramResult = paramsSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL parameters",
      error: paramResult.error.flatten().fieldErrors,
    });
  }

  const { id: queryId } = paramResult.data;

  
  try {
    const response = await queryService.deleteQuery(queryId);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Failed to delete query",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Query deleted successfully",
      data: response,
    });
  } catch (error) {
    console.error("Internal server error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
