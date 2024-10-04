import { User } from "@prisma/client";
import AuthRepository from "../repositories/AuthRepository";
import { AppError } from "../../libraries/error-handling/AppError";
import { NextFunction, Response, Request } from "express";
import { BaseController } from "../../domains/controllers/base.controller";

export default class AuthController extends BaseController {
  private authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    super();
    this.authRepository = authRepository;
  }
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.authRepository.create(req.body);
      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
}
