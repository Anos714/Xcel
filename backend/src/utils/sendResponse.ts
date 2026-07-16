import type { Response } from 'express';

export const sendResponse = <T>( res: Response, 
    statusCode: number, 
    message: string,
    data?: T 
) => {

    const success = statusCode >= 200 && statusCode < 300;

    return res.status(statusCode).json({
        success,
        message,
        ...(data !== undefined && { data }), 
    });

}