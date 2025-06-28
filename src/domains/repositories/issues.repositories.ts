import { Issues, PrismaClient } from "@prisma/client";
import { AppError } from "../../libraries/error-handling/AppError";
import { BaseRepository } from "./BaseRepositories";

export default class IssueRepository extends BaseRepository<Issues> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  async getAll(): Promise<Partial<Issues>[]> {
    try {
      const issues = await this.prisma.issues.findMany({
        where: {},
        include: {
          room: {
            select: {
              id: true,
              roomNumber: true,
            },
          },
          user: {
            select: {
              id: true,

              email: true,
            },
          },
        },
      });
      return issues;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get list of issues: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async getAllByUser({
    userId,
    roomId,
  }: {
    userId: string;
    roomId: string;
  }): Promise<Partial<Issues>[]> {
    try {
      const issues = await this.prisma.issues.findMany({
        where: { userId, roomId },
      });
      return issues;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get list of issues: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async getById(id: string): Promise<Partial<Issues> | null> {
    try {
      const issue = await this.prisma.issues.findUnique({
        where: { id },
      });
      return issue;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get the room info: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async create(data: Partial<Issues>): Promise<Partial<Issues>> {
    try {
      // Only pick fields allowed by IssuesCreateInput (usually exclude id, createdAt, updatedAt)
      const {
        userId,
        title,
        description,
        status,
        priority,
        isResolved,
        resolvedAt,
        roomId,
        bookingId,
      } = data;
      if (!userId) {
        throw new AppError("validation-error", "User ID is required", 400);
      }
      const issue = await this.prisma.issues.create({
        data: {
          userId,
          title: title ?? "<Untitled>",
          description: description ?? "<No Description>",
          status,
          priority,
          isResolved,
          resolvedAt,
          roomId,
          bookingId,
        },
      });
      return issue;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to create new issue: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async getByUserId(userId: string): Promise<Partial<Issues>[]> {
    try {
      const issues = await this.prisma.issues.findMany({
        where: { userId },
      });
      return issues;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get issues for user: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async update(id: string, data: Partial<Issues>): Promise<Partial<Issues>> {
    try {
      const issue = await this.prisma.issues.findUnique({
        where: { id },
      });
      if (!issue) {
        // precondition failed -412
        throw new AppError("database-error", "Issue not found", 412);
      }
      const updatedIssue = await this.prisma.issues.update({
        where: { id },
        data: data,
      });
      return updatedIssue;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get the room info: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
  async delete(id: string): Promise<any> {
    try {
      const issue = await this.prisma.issues.findUnique({
        where: { id },
      });
      if (!issue) {
        // precondition failed -412
        throw new AppError("database-error", "Issue not found", 412);
      }
      const t = await this.prisma.$transaction([
        this.prisma.issues.delete({
          where: { id },
        }),
      ]);

      return t;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(
          "database-error",
          `Failed to get the issue info: ${
            error instanceof Error ? error.message : "Unexpected error"
          }`,
          500
        );
      }
    }
  }
}
