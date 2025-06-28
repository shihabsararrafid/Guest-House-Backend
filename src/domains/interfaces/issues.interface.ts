import { z } from "zod";
export enum IssueStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum IssuePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}
export const updateIssueSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  reportedBy: z.string().min(1, "Reporter is required").optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
