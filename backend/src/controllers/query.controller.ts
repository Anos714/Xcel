import type { NextFunction, Request, Response } from "express";
import {
  paramsSchema,
  querySchema,
  updateQuerySchema,
} from "../validators/query.validator";
import { queryService } from "../services/query.service";
import { catchAsync } from "../utils/catchAsync";




export const createQuery =catchAsync( async (req: Request, res: Response,next:NextFunction) => {
  const bodyResult = querySchema.safeParse(req.body);

  if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      error: bodyResult.error.flatten().fieldErrors,
    });
  }

  const { query } = bodyResult.data;
  
  


    const response = await queryService.createQuery(query);
   

    return res.status(201).json({
      success: true,
      message: "Query created successfully",
      data: response,
    });
 
});

export const getQueries =catchAsync( async (req: Request, res: Response,next:NextFunction) => {
 
 
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
  
});

export const updateQuery =catchAsync( async (req: Request, res: Response,next:NextFunction) => {
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
 
});

export const deleteQuery =catchAsync( async (req: Request, res: Response,next:NextFunction) => {
  const paramResult = paramsSchema.safeParse(req.params);

  if (!paramResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL parameters",
      error: paramResult.error.flatten().fieldErrors,
    });
  }

  const { id: queryId } = paramResult.data;

  

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
 
});
