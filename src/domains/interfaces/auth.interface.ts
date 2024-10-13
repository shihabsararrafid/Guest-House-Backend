import { z } from "zod";
export const registerSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z
  .object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6),
  })
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided",
    path: ["username", "email"],
  });
