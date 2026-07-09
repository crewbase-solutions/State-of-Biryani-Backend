import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { categoryService } from "./category.service.js";

class CategoryController {
  createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    ApiResponse.success(res, "Category created successfully", category, 201);
  });

  getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const categories = await categoryService.getCategories(page, limit);
    ApiResponse.success(res, "Categories fetched successfully", categories);
  });

  getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const category = await categoryService.getCategory(id);
    ApiResponse.success(res, "Category fetched successfully", category);
  });

  updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const category = await categoryService.updateCategory(id, req.body);
    ApiResponse.success(res, "Category updated successfully", category);
  });

  deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    await categoryService.deleteCategory(id);
    ApiResponse.success(res, "Category deleted successfully");
  });
}

export const categoryController = new CategoryController();
