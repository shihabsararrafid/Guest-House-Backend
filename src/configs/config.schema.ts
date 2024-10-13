import { z } from "zod";
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string(),
  RATE: z.coerce.number().min(0),
  PORT: z.coerce.number().min(1000).default(4000),
});

export default schema;
