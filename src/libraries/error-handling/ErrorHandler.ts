// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";
import { logger } from "../log/logger";

export const errorHandlerMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorCode = "internal-server-error";

  if (err instanceof AppError) {
    statusCode = err.HTTPStatus;
    message = err.message;
    errorCode = err.name;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Log the error
  logger.error(`${errorCode}: ${message}`, {
    error: err,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  // If in development, send the stack trace
  const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      stack,
    },
  });
};

// Catch-all for unhandled errors
export const unhandledErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: {
      code: "internal-server-error",
      message: "An unexpected error occurred",
    },
  });
};

// Handle 404 errors
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError("not-found", "Resource not found", 404);
  next(error);
};
