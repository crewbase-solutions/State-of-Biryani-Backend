import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { authService } from "./auth.service.js";

class AuthController {
  // Customer
  customerSendOtp = asyncHandler(async (req, res) => {
    await authService.sendOtp(req.body.phoneNumber, "CUSTOMER");
    ApiResponse.success(res, "OTP sent successfully");
  });

  customerVerifyOtp = asyncHandler(async (req, res) => {
    const result = await authService.verifyOtp(req.body.phoneNumber, req.body.code, "CUSTOMER");
    ApiResponse.success(res, "Login successful", result);
  });

  // Admin
  adminSendOtp = asyncHandler(async (req, res) => {
    await authService.sendOtp(req.body.phoneNumber, "ADMIN");
    ApiResponse.success(res, "OTP sent successfully");
  });

  adminVerifyOtp = asyncHandler(async (req, res) => {
    const result = await authService.verifyOtp(req.body.phoneNumber, req.body.code, "ADMIN");
    ApiResponse.success(res, "Login successful", result);
  });

  // Manager
  managerSendOtp = asyncHandler(async (req, res) => {
    await authService.sendOtp(req.body.phoneNumber, "MANAGER");
    ApiResponse.success(res, "OTP sent successfully");
  });

  managerVerifyOtp = asyncHandler(async (req, res) => {
    const result = await authService.verifyOtp(req.body.phoneNumber, req.body.code, "MANAGER");
    ApiResponse.success(res, "Login successful", result);
  });

  // Delivery
  deliverySendOtp = asyncHandler(async (req, res) => {
    await authService.sendOtp(req.body.phoneNumber, "DELIVERY");
    ApiResponse.success(res, "OTP sent successfully");
  });

  deliveryVerifyOtp = asyncHandler(async (req, res) => {
    const result = await authService.verifyOtp(req.body.phoneNumber, req.body.code, "DELIVERY");
    ApiResponse.success(res, "Login successful", result);
  });

  logout = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.slice(7) ?? "";
    await authService.logout(token);
    ApiResponse.success(res, "Logged out successfully");
  });

  refresh = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.slice(7) ?? "";
    const result = await authService.refreshSession(token);
    ApiResponse.success(res, "Session refreshed", result);
  });

  me = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.slice(7) ?? "";
    const user = await authService.getMe(token);
    ApiResponse.success(res, "User fetched", user);
  });
}

export const authController = new AuthController();
