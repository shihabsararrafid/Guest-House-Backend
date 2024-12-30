import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
import { BaseRepository } from "./BaseRepositories";
import { z } from "zod";

import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
} from "../interfaces/user.interface";

export default class UserRepository extends BaseRepository<User> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async getAll(
    query: z.infer<typeof getUsersQuerySchema>
  ): Promise<Partial<User>[]> {
    try {
      let prismaQuery: any = {};
      let skip: number | undefined;
      let take: number | undefined;
      // Build query based on filters
      if (query.role) {
        prismaQuery.role = query.role;
      }
      if (query.isActive !== undefined) {
        prismaQuery.isActive = query.isActive;
      }
      // Handle pagination
      if (query.page && query.limit) {
        skip = (query.page - 1) * query.limit;
        take = query.limit;
      }
      const users = await this.prisma.user.findMany({
        where: prismaQuery,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          currentPosition: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoggedIn: true,
          // Exclude sensitive fields like password and salt
        },
        skip: skip,
        take: take,
        orderBy: {
          createdAt: "desc",
        },
      });

      return users;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get users: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async getById(id: string): Promise<Partial<User> | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          roll: true,
          phone: true,
          currentPosition: true,
          currentRole: true,
          address: true,
          thana: true,
          district: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoggedIn: true,
          // Exclude password and salt
        },
      });

      if (!user) {
        throw new AppError("not-found", "User not found", 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async create(data: z.infer<typeof createUserSchema>): Promise<Partial<User>> {
    try {
      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(data.password, salt);

      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashed,
          salt,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          isActive: true,
          createdAt: true,
          // Exclude password and salt from return
        },
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to create user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async update(
    id: string,
    data: z.infer<typeof updateUserSchema>
  ): Promise<Partial<User>> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          department: true,
          currentPosition: true,
          isActive: true,
          updatedAt: true,
          // Exclude password and salt
        },
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to update user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to delete user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async verifyEmail(id: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { isEmailVerified: true },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to verify email: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          password: true,
          salt: true,
        },
      });

      if (!user) {
        throw new AppError("not-found", "User not found", 404);
      }

      const isValid = await bcrypt.compare(
        user.password,
        currentPassword + user.salt
      );
      if (!isValid) {
        throw new AppError("auth-error", "Current password is incorrect", 401);
      }

      const hashedPassword = await bcrypt.hash(newPassword, user.salt);

      await this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to update password: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          lastLoggedIn: new Date(),
          retryCount: 0, // Reset retry count on successful login
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to update last login: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async incrementRetryCount(id: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { retryCount: true },
      });

      if (!user) {
        throw new AppError("not-found", "User not found", 404);
      }

      const newRetryCount = user.retryCount + 1;
      const shouldDeactivate = newRetryCount >= 5; // Deactivate after 5 attempts

      await this.prisma.user.update({
        where: { id },
        data: {
          retryCount: newRetryCount,
          isActive: shouldDeactivate ? false : true,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to update retry count: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }

  async findByEmail(email: string): Promise<Partial<User> | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          salt: true,
          isActive: true,
          retryCount: true,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to find user by email: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
}
