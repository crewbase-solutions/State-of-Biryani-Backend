import { asyncHandler } from "../../core/middleware/asyncHandler.js";
import { ApiResponse } from "../../core/responses/ApiResponse.js";
import { variationService } from "./variation.service.js";

class VariationController {
  add = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const variation = await variationService.addVariation(id, req.body);
    ApiResponse.success(res, "Variation added successfully", variation, 201);
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const variation = await variationService.updateVariation(id, req.body);
    ApiResponse.success(res, "Variation updated successfully", variation);
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    await variationService.deleteVariation(id);
    ApiResponse.success(res, "Variation deleted successfully");
  });
}

export const variationController = new VariationController();
