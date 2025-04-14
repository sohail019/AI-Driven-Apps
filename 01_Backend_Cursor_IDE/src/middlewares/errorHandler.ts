import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

/**
 * Global error handling middleware
 * Handles all errors thrown in the application
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid input data",
      errors: err.message,
    });
  }

  // Handle mongoose duplicate key errors
  if (err.name === "MongoError" && (err as any).code === 11000) {
    return res.status(400).json({
      status: "fail",
      message: "Duplicate field value",
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Token expired",
    });
  }

  // Log error for debugging in development
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR 💥", err);
  }

  // Generic error response for production
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
