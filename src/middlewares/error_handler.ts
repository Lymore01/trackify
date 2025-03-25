import type { Request, Response, NextFunction } from 'express';

interface ICustomError extends Error {
    status: number;
}

export const errorHandler = (err: ICustomError, req: Request, res:Response, next:NextFunction) => {
    console.error(err.stack); // dev debugging

    const statusCode = err.status || 500;
    const errorMessage = err.message || "Something went wrong!"

    res.status(statusCode).json({
        success: false,
        error: errorMessage
    })
}