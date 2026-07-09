import { Request, Response } from "express";
import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { customerService } from "./customer.service.js";
import { ICustomer } from "./customer.model.js";
import { AuthRequest } from "../auth/auth.types.js";

class CustomerController {
  completeProfile = asyncHandler(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const customer = await customerService.completeProfile(user, req.body as Partial<ICustomer>);
    ApiResponse.success(res, "Profile completed successfully", customer, 201);
  });

  getMyProfile = asyncHandler(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const customer = await customerService.getMyProfile(user);
    ApiResponse.success(res, "Customer profile fetched successfully", customer);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const customer = await customerService.updateProfile(user, req.body as Partial<ICustomer>);
    ApiResponse.success(res, "Profile updated successfully", customer);
  });

  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    await customerService.deleteAccount(user);
    ApiResponse.success(res, "Account deleted successfully");
  });
}

export const customerController = new CustomerController();
