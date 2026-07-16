import type{Request,Response,NextFunction} from 'express'
import { ZodError } from 'zod'
import AppError from '../utils/AppError.js'
import { logger } from '../lib/logger';

export const errorHandler=(error:Error,req:Request,res:Response,_next:NextFunction)=>{
// custom App Error
if(error instanceof AppError){
     return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
}


// Zod Validation Error
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten().fieldErrors,
    });
  }

  // neon db unique constraint error handling
  if ((error as any).code === "23505") {
    return res.status(409).json({ 
      success: false,
      message: "Data already exists..",
    });
  }

   // Unknown Error
  logger.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}