import { z } from "zod";
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string(),
  RATE: z.coerce.number().min(0),
  PORT: z.coerce.number().min(1000).default(4000),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  COOKIE_SECRET: z.string(),
  ENCRYPTION_KEY: z.string(),
  CLIENT_URL: z.string(),
  STRIPE_SECRET_KEY: z.string(),
});

export default schema;
