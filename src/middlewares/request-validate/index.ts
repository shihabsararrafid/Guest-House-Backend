import { NextFunction, Response, Request } from "express";
import { Schema, ValidationError } from "joi";
import { logger } from "../../libraries/log/logger";

interface ValidateRequestOptions {
  schema: Schema;
  isParam?: boolean;
}

function validateRequest({ schema, isParam = false }: ValidateRequestOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = isParam ? req.params : req.body;
    const validationResult = schema.validate(input, { abortEarly: false });

    if (validationResult.error) {
      logger.error(`${req.method} ${req.originalUrl} Validation failed`, {
        errors: validationResult.error.details.map((detail) => detail.message),
      });

      return res.status(400).json({
        errors: validationResult.error.details.map((detail) => detail.message),
      });
    }

    // Validation successful - proceed
    next();
  };
}

export { validateRequest };
