import { isValidObjectId } from "mongoose";
import { Variation } from "./variation.model.js";
import { MenuItem } from "../menuItem/menuItem.model.js";
import { AppError } from "../../core/errors/AppError.js";
import { cache } from "../../lib/cache/cache.js";

const validateId = (id: string) => {
  if (!isValidObjectId(id)) throw new AppError("Invalid ID", 400);
};

class VariationService {
  async addVariation(menuItemId: string, data: { name: string; price: number; sortOrder?: number }) {
    validateId(menuItemId);
    const item = await MenuItem.findById(menuItemId);
    if (!item) throw new AppError("Menu item not found", 404);
    const variation = await Variation.create({ ...data, menuItem: menuItemId });
    await cache.delByPattern("menu:*");
    return variation;
  }

  async updateVariation(variationId: string, data: { name?: string; price?: number; isAvailable?: boolean; sortOrder?: number }) {
    validateId(variationId);
    const variation = await Variation.findByIdAndUpdate(variationId, { $set: data }, { new: true, runValidators: true });
    if (!variation) throw new AppError("Variation not found", 404);
    await cache.delByPattern("menu:*");
    return variation;
  }

  async deleteVariation(variationId: string) {
    validateId(variationId);
    const variation = await Variation.findById(variationId);
    if (!variation) throw new AppError("Variation not found", 404);

    const menuItem = await MenuItem.findById(variation.menuItem);
    if (!menuItem || !menuItem.isActive) throw new AppError("Menu item not found or inactive", 404);

    const count = await Variation.countDocuments({ menuItem: variation.menuItem });
    if (count <= 1) throw new AppError("Cannot delete the only variation of a menu item", 400);

    await variation.deleteOne();
    await cache.delByPattern("menu:*");
  }
}

export const variationService = new VariationService();
