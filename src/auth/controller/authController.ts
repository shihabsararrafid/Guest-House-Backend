import { User } from "@prisma/client";
import AuthRepository from "../repositories/AuthRepository";
import { AppError } from "../../libraries/error-handling/AppError";
import { NextFunction, Response, Request } from "express";

export default class AuthController {
  private authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Partial<User>> {
    try {
      return this.authRepository.create(req.body);
    } catch (error) {
      throw new AppError(
        "Unhandled Error",
        error instanceof Error
          ? error.message
          : "Unwanted event occurred in server",
        500
      );
    }
  }
}
