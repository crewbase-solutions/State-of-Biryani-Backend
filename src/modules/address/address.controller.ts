import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { addressService } from "./address.service.js";
import { IAddress } from "./address.model.js";
import { AuthRequest } from "../auth/auth.types.js";

class AddressController {
  add = asyncHandler(async (req, res) => {
    const { user } = req as unknown as AuthRequest;
    const address = await addressService.addAddress(user.id, req.body as Partial<IAddress>);
    ApiResponse.success(res, "Address added successfully", address, 201);
  });

  getAll = asyncHandler(async (req, res) => {
    const { user } = req as unknown as AuthRequest;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const addresses = await addressService.getMyAddresses(user.id, page, limit);
    ApiResponse.success(res, "Addresses fetched successfully", addresses);
  });

  getById = asyncHandler(async (req, res) => {
    const { user, params } = req as unknown as AuthRequest;
    const address = await addressService.getAddressById(user.id, params.id as string);
    ApiResponse.success(res, "Address fetched successfully", address);
  });

  update = asyncHandler(async (req, res) => {
    const { user, params } = req as unknown as AuthRequest;
    const address = await addressService.updateAddress(user.id, params.id as string, req.body as Partial<IAddress>);
    ApiResponse.success(res, "Address updated successfully", address);
  });

  setDefault = asyncHandler(async (req, res) => {
    const { user, params } = req as unknown as AuthRequest;
    const address = await addressService.setDefaultAddress(user.id, params.id as string);
    ApiResponse.success(res, "Default address updated successfully", address);
  });

  delete = asyncHandler(async (req, res) => {
    const { user, params } = req as unknown as AuthRequest;
    await addressService.deleteAddress(user.id, params.id as string);
    ApiResponse.success(res, "Address deleted successfully");
  });
}

export const addressController = new AddressController();
