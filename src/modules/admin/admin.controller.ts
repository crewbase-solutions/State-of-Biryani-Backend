import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { adminService } from "./admin.service.js";

class AdminController {
  createManager = asyncHandler(async (req, res) => {
    const { phone, name } = req.body;
    const user = await adminService.createUser(phone, name, "MANAGER");
    ApiResponse.success(res, "Manager created successfully", user, 201);
  });

  createDelivery = asyncHandler(async (req, res) => {
    const { phone, name } = req.body;
    const user = await adminService.createUser(phone, name, "DELIVERY");
    ApiResponse.success(res, "Delivery user created successfully", user, 201);
  });

  createAdmin = asyncHandler(async (req, res) => {
    const { phone, name } = req.body;
    const user = await adminService.createUser(phone, name, "ADMIN");
    ApiResponse.success(res, "Admin created successfully", user, 201);
  });

  getUsers = asyncHandler(async (req, res) => {
    const role = req.query.role as "ADMIN" | "MANAGER" | "DELIVERY" | undefined;
    const users = await adminService.getUsers(role);
    ApiResponse.success(res, "Users fetched successfully", users);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    await adminService.deleteUser(id);
    ApiResponse.success(res, "User deleted successfully");
  });
}

export const adminController = new AdminController();
