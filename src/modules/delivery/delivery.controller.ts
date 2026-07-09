import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { deliveryService } from "./delivery.service.js";
import { AuthRequest } from "../auth/auth.types.js";

class DeliveryController {
  completeProfile = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const profile = await deliveryService.completeProfile(user, req.body);
    ApiResponse.success(res, "Profile completed", { ...profile.toObject(), role: user.role }, 201);
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const profile = await deliveryService.getProfile(user);
    ApiResponse.success(res, "Profile fetched", { ...profile.toObject(), role: user.role });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const profile = await deliveryService.updateProfile(user, req.body);
    ApiResponse.success(res, "Profile updated", { ...profile.toObject(), role: user.role });
  });

  updateLocation = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const { lat, lng } = req.body;
    const profile = await deliveryService.updateLocation(user, lat, lng);
    ApiResponse.success(res, "Location updated", { ...profile.toObject(), role: user.role });
  });

  toggleAvailability = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const profile = await deliveryService.toggleAvailability(user);
    ApiResponse.success(res, `You are now ${profile.isAvailable ? "available" : "unavailable"}`, { ...profile.toObject(), role: user.role });
  });
}

export const deliveryController = new DeliveryController();
