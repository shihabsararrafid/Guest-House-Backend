import { NextFunction, Response, Request } from "express";

import { logger } from "../../libraries/log/logger";
import { Schema, z } from "zod";

interface ValidateRequestOptions {
  schema: Schema;
  isParam?: boolean;
}

function validateRequest({ schema, isParam = false }: ValidateRequestOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = isParam ? req.params : req.body;
    try {
      const validationResult = schema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // console.log(finalConfig);
        logger.error(`${req.method} ${req.originalUrl} Validation failed`, {
          errors: error.issues.map((detail) => detail.message),
        });
        return res.status(400).json({
          errors: error.issues.map((detail) => detail.message),
        });
      } else {
        // Re-throw if it's not a ZodError
        throw error;
      }
    }

    // Validation successful - proceed
    next();
  };
}

export { validateRequest };
