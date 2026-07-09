import { Router } from "express";
import { authController } from "./auth.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { otpRateLimiter } from "../../core/middleware/rateLimiter.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { sendOtpSchema, verifyOtpSchema, refreshSchema } from "../../core/validators/schemas.js";

const router = Router();

// Customer
router.post("/customer/send-otp", otpRateLimiter, validate(sendOtpSchema), authController.customerSendOtp);
router.post("/customer/verify-otp", validate(verifyOtpSchema), authController.customerVerifyOtp);

// Admin
router.post("/admin/send-otp", otpRateLimiter, validate(sendOtpSchema), authController.adminSendOtp);
router.post("/admin/verify-otp", validate(verifyOtpSchema), authController.adminVerifyOtp);

// Manager
router.post("/manager/send-otp", otpRateLimiter, validate(sendOtpSchema), authController.managerSendOtp);
router.post("/manager/verify-otp", validate(verifyOtpSchema), authController.managerVerifyOtp);

// Delivery
router.post("/delivery/send-otp", otpRateLimiter, validate(sendOtpSchema), authController.deliverySendOtp);
router.post("/delivery/verify-otp", validate(verifyOtpSchema), authController.deliveryVerifyOtp);

// Logout (any authenticated role)
router.post("/logout", requireAuth("CUSTOMER", "ADMIN", "MANAGER", "DELIVERY"), authController.logout);

// Refresh session
router.post("/refresh", validate(refreshSchema), authController.refresh);

// Get current user
router.get("/me", authController.me);

export default router;
