import { NextFunction, Request, Response } from "express";
import { AppError } from "../../libraries/error-handling/AppError";
import UserRepository from "../repositories/user.repositories";
import { BaseController } from "./base.controller";
import { z } from "zod";
import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
} from "../interfaces/user.interface";
import EmailService from "../services/email.service";

type CreateUserType = z.infer<typeof createUserSchema>;
type UpdateUserType = z.infer<typeof updateUserSchema>;
type GetUsersQueryType = z.infer<typeof getUsersQuerySchema>;

const emailService = new EmailService();

export default class UserController extends BaseController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    super();
    this.userRepository = userRepository;
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userRepository.create(req.body as CreateUserType);

      // Send welcome email
      const emailHtml = `Welcome to our platform, ${user.firstName}!`; // You can use a proper email template here
      await emailService.sendEmail(
        user.email ?? "",
        "Welcome to Our Platform",
        emailHtml
      );

      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.userRepository.getAll(
        req.query as unknown as GetUsersQueryType
      );
      this.sendSuccessResponse(res, users);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async getSingleUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.getById(id);
      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.update(
        id,
        req.body as UpdateUserType
      );
      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.delete(id);
      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.verifyEmail(id);
      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      const user = await this.userRepository.updatePassword(
        id,
        currentPassword,
        newPassword
      );
      this.sendSuccessResponse(res, {
        message: "Password updated successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async deactivateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.update(id, { isActive: false });
      this.sendSuccessResponse(res, user);
    } catch (error) {
      if (error instanceof AppError) {
        this.sendErrorResponse(res, error);
      } else {
        next(error);
      }
    }
  }

  async reactivateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userRepository.update(id, {
        isActive: true,
      });
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
