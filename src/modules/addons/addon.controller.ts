import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { addonService } from "./addon.service.js";

class AddonController {
  add = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const addon = await addonService.addAddon(id, req.body);
    ApiResponse.success(res, "Addon added successfully", addon, 201);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const addon = await addonService.updateAddon(id, req.body);
    ApiResponse.success(res, "Addon updated successfully", addon);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    await addonService.deleteAddon(id);
    ApiResponse.success(res, "Addon deleted successfully");
  });
}

export const addonController = new AddonController();
