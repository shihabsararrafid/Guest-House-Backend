import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../domains/controllers/base.controller";
import { AppError } from "../../libraries/error-handling/AppError";
import AuthRepository from "../repositories/AuthRepository";
import EmailService from "../../domains/services/email.service";

export default class AuthController extends BaseController {
  private authRepository: AuthRepository;
  private emailService: EmailService;
  constructor(authRepository: AuthRepository, emailService: EmailService) {
    super();
    this.authRepository = authRepository;
    this.emailService = emailService;
  }
  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.authRepository.create(req.body);
      this.emailService.sendEmail("", "Testing", ",<h1>Hello Rafid</h1>");
      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }
  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const r = loginSchema.validateAsync(req.body);
      const user = await this.authRepository.login(req.body);
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
