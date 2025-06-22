import { z } from "zod";

// Suggested schema structure
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  // ... other fields
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  currentPosition: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  role: z.string().optional(),
  // ... other updateable fields
});

export const getUsersQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  // ... other query parameters
});
export const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});
