import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  PORT: z.coerce.number().default(5000),

  MONGO_URI: z.string().min(1, "MongoDB URI is required"),

  JWT_ACCESS_SECRET: z.string().min(10),

  JWT_REFRESH_SECRET: z.string().min(10),

  REDIS_URL: z.string().min(1, "Redis URL is required"),

  DATABASE_URL: z.string().min(1, "Database URL is required"),

  TWILIO_ACCOUNT_SID: z.string().min(1, "Twilio Account SID is required"),
  TWILIO_AUTH_TOKEN: z.string().min(1, "Twilio Auth Token is required"),
  TWILIO_PHONE_NUMBER: z.string().min(1, "Twilio Phone Number is required"),

  BETTER_AUTH_SECRET: z.string().min(1, "Better Auth Secret is required"),
  BETTER_AUTH_URL: z.string().min(1, "Better Auth URL is required"),
});

export const env = envSchema.parse(process.env);