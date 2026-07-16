import type { NextFunction, Request, Response } from "express";
import {
  paramsSchema,
  querySchema,
  updateQuerySchema,
} from "../validators/query.validator.js";
import { queryService } from "../services/query.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/sendResponse.js";




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
   

    return sendResponse(
    res, 
    201, 
    "Query created successfully", 
    response
);

 
});

export const getQueries =catchAsync( async (req: Request, res: Response,next:NextFunction) => {
 
 
    const response = await queryService.getQueries();
    if (!response) {
      return sendResponse(
    res, 
    404, 
    "Failed to fetch queries"
);

    }

   return sendResponse(
    res, 
    200, 
    "Queries fetched successfully", 
    response
);
  
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
      return sendResponse(
        res,
        404,
        "Failed to update query",
      )
    }

   return sendResponse(
    res, 
    200, 
    "Query updated successfully", 
    response
);
 
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
      return sendResponse(
        res,
        404,
        "Failed to delete query",
      )
    }

    return sendResponse(
        res,
        200,
        "Query deleted successfully",
        response
    );
 
});
