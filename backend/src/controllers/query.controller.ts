import type { Request, Response } from "express";
import {
  paramsSchema,
  querySchema,
  updateQuerySchema,
} from "../../validators/query.validator";
import { queryService } from "../services/query.service";
import { getAuth } from "@clerk/express";

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

  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const response = await queryService.createQuery(query, userId);
    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Failed to create query",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Query created successfully",
      data: res,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const getQueries = async (req: Request, res: Response) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const response = await queryService.getQueries(userId);
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
      error: bodyResult.error.flatten().fieldErrors,
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

  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const response = await queryService.updateQuery(queryId, userId, active);

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

  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const response = await queryService.deleteQuery(queryId, userId);

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
