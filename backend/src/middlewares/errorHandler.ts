import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[API Error] Status ${statusCode}: ${message}`);
  if (err.stack && process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};
