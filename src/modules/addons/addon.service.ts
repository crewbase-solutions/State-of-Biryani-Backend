import { isValidObjectId } from "mongoose";
import { Addon } from "./addon.model.js";
import { MenuItem } from "../menuItem/menuItem.model.js";
import { AppError } from "../../core/errors/AppError.js";

const validateId = (id: string) => {
  if (!isValidObjectId(id)) throw new AppError("Invalid ID", 400);
};

class AddonService {
  async addAddon(menuItemId: string, data: { name: string; price: number }) {
    validateId(menuItemId);
    const item = await MenuItem.findById(menuItemId);
    if (!item) throw new AppError("Menu item not found", 404);
    return await Addon.create({ ...data, menuItem: menuItemId });
  }

  async updateAddon(addonId: string, data: { name?: string; price?: number; isAvailable?: boolean }) {
    validateId(addonId);
    const addon = await Addon.findByIdAndUpdate(addonId, { $set: data }, { new: true, runValidators: true });
    if (!addon) throw new AppError("Addon not found", 404);
    return addon;
  }

  async deleteAddon(addonId: string) {
    validateId(addonId);
    const addon = await Addon.findByIdAndUpdate(addonId, { $set: { isAvailable: false } }, { new: true });
    if (!addon) throw new AppError("Addon not found", 404);
  }
}

export const addonService = new AddonService();
