import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { managerService } from "./manager.service.js";
import { AuthRequest } from "../auth/auth.types.js";

class ManagerController {
  completeProfile = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const profile = await managerService.completeProfile(user, req.body);
    ApiResponse.success(res, "Profile completed", { ...profile.toObject(), role: user.role }, 201);
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const profile = await managerService.getProfile(user);
    ApiResponse.success(res, "Profile fetched", { ...profile.toObject(), role: user.role });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = (req as AuthRequest).user;
    const profile = await managerService.updateProfile(user, req.body);
    ApiResponse.success(res, "Profile updated", { ...profile.toObject(), role: user.role });
  });
}

export const managerController = new ManagerController();
