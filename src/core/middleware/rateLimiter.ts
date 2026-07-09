import rateLimit from "express-rate-limit";
import { AppError } from "../errors/AppError.js";

export const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new AppError("Too many OTP requests. Please try again after 10 minutes.", 429));
  },
});
