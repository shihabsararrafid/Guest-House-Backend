import { verify } from "jsonwebtoken";
import { $Enums, PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { BaseRepository } from "../../domains/repositories/BaseRepositories";
import { AppError } from "../../libraries/error-handling/AppError";

import { loginSchema } from "../../domains/interfaces/auth.interface";
import { z } from "zod";

type ILogin = z.infer<typeof loginSchema>;
enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  RECEPTIONIST = "RECEPTIONIST",
  SUPERADMIN = "SUPERADMIN",
}
export interface VerifyEmailPayload {
  email: string;
  username: string | null;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  id: string;
}

export default class AuthRepository extends BaseRepository<User> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  getAll(): Promise<Partial<User>[]> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<Partial<User> | null> {
    throw new Error("Method not implemented.");
  }
  async create(data: {
    role?: $Enums.Role;
    email: string;
    username: string | null;
    password: string;
  }): Promise<Partial<User>> {
    // generate salt and hashed password

    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(data.password, salt);
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (user)
        throw new AppError(
          "database-error",
          "User already Exists with the email",
          409
        );
      return this.prisma.user.create({
        data: { ...data, salt, password: hashed },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to create new user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async login(data: ILogin): Promise<Partial<User>> {
    try {
      const lookupField = data.email
        ? { email: data.email }
        : { username: data.username };

      const user = await this.prisma.user.findUnique({
        where: lookupField,
      });
      if (!user) {
        throw new AppError("auth-error", "User not found", 404);
      }
      if (!user.isActive) {
        throw new AppError(
          "auth-error",
          "You are an inactive user . Contact with administration",
          403
        );
      }
      if (!user.isEmailVerified) {
        throw new AppError(
          "auth-error",
          "Email not verified. Please check your email for verification instructions.",
          401
        );
      }
      const isChecked = await bcrypt.compare(data.password, user.password);
      if (!isChecked) {
        throw new AppError("auth-error", "You are unauthorized", 401);
      }
      // delete user.password
      const { password, ...response } = user;
      return response;
      // console.log(isChecked);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to create new user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async verifyEmail(data: VerifyEmailPayload): Promise<Partial<User>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: data.id,
          email: data.email,
        },
      });
      if (!user) {
        throw new AppError("auth-error", "User not found", 404);
      }
      if (user.isEmailVerified) {
        throw new AppError("verification-error", "Email Already Verified", 409);
      }

      const result = await this.prisma.user.update({
        where: {
          id: data.id,
          email: data.email,
        },
        data: {
          isEmailVerified: true,
          isActive: true,
        },
      });
      // delete user.password
      const { password, ...response } = result;
      return response;
      // console.log(isChecked);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to create new user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  update(id: string, data: Partial<User>): Promise<Partial<User>> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<Partial<User>> {
    throw new Error("Method not implemented.");
  }
}
