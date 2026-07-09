import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { menuItemService } from "./menuItem.service.js";

class MenuItemController {
  create = asyncHandler(async (req, res) => {
    const item = await menuItemService.createMenuItem(req.body);
    ApiResponse.success(res, "Menu item created successfully", item, 201);
  });

  getAll = asyncHandler(async (req, res) => {
    const categoryId = req.query.category as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const items = await menuItemService.getMenuItems(categoryId, page, limit);
    ApiResponse.success(res, "Menu items fetched successfully", items);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const item = await menuItemService.updateMenuItem(id, req.body);
    ApiResponse.success(res, "Menu item updated successfully", item);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    await menuItemService.deleteMenuItem(id);
    ApiResponse.success(res, "Menu item deleted successfully");
  });
}

export const menuItemController = new MenuItemController();
