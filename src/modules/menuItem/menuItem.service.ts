import slugify from "slugify";
import { isValidObjectId } from "mongoose";
import { MenuItem } from "./menuItem.model.js";
import { Variation } from "../variations/variation.model.js";
import { Category } from "../category/category.model.js";
import { AppError } from "../../core/errors/AppError.js";
import { cache } from "../../lib/cache/cache.js";

const MENU_TTL = 60; // seconds
const menuKey = (page: number, limit: number, categoryId?: string) =>
  `menu:${categoryId ?? "all"}:${page}:${limit}`;

const validateId = (id: string) => {
  if (!isValidObjectId(id)) throw new AppError("Invalid ID", 400);
};

class MenuItemService {
  async createMenuItem(data: {
    name: string;
    description?: string;
    images?: string[];
    category: string;
    isVeg: boolean;
    sortOrder?: number;
    variations: { name: string; price: number; sortOrder?: number }[];
  }) {
    const slug = slugify(data.name, { lower: true, strict: true, trim: true });

    validateId(data.category);
    const [exists, categoryExists] = await Promise.all([
      MenuItem.findOne({ $or: [{ name: data.name }, { slug }] }),
      Category.findById(data.category),
    ]);
    if (exists) throw new AppError("Menu item already exists", 409);
    if (!categoryExists) throw new AppError("Category not found", 404);

    if (!data.variations || data.variations.length === 0)
      throw new AppError("At least one variation is required", 400);

    const menuItem = await MenuItem.create({
      name: data.name,
      slug,
      description: data.description,
      images: data.images ?? [],
      category: data.category,
      isVeg: data.isVeg,
      sortOrder: data.sortOrder ?? 0,
    });

    const variations = await Variation.insertMany(
      data.variations.map((v) => ({ ...v, menuItem: menuItem._id }))
    );

    await cache.delByPattern("menu:*");
    return { ...menuItem.toObject(), variations };
  }

  async getMenuItems(categoryId?: string, page = 1, limit = 20) {
    const key = menuKey(page, limit, categoryId);
    const cached = await cache.get(key);
    if (cached) return cached;

    const filter: Record<string, unknown> = { isActive: true, isAvailable: true };
    if (categoryId) {
      validateId(categoryId);
      filter.category = categoryId;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .populate("category", "name slug")
        .sort({ sortOrder: 1, createdAt: 1 })
        .skip(skip)
        .limit(limit),
      MenuItem.countDocuments(filter),
    ]);

    const itemIds = items.map((i) => i._id);
    const variations = await Variation.find({ menuItem: { $in: itemIds }, isAvailable: true }).sort({ sortOrder: 1 });

    const result = {
      data: items.map((item) => ({
        ...item.toObject(),
        variations: variations.filter((v) => v.menuItem.equals(item._id)),
      })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };

    await cache.set(key, result, MENU_TTL);
    return result;
  }

  async updateMenuItem(
    id: string,
    data: {
      name?: string;
      description?: string;
      images?: string[];
      category?: string;
      isVeg?: boolean;
      isAvailable?: boolean;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) {
    validateId(id);
    const item = await MenuItem.findById(id);
    if (!item) throw new AppError("Menu item not found", 404);

    if (data.name && data.name !== item.name) {
      const slug = slugify(data.name, { lower: true, strict: true, trim: true });
      const exists = await MenuItem.findOne({ $or: [{ name: data.name }, { slug }], _id: { $ne: id } });
      if (exists) throw new AppError("Menu item already exists", 409);
      item.name = data.name;
      item.slug = slug;
    }

    if (data.description !== undefined) item.description = data.description;
    if (data.images !== undefined) item.images = data.images;
    if (data.category !== undefined) item.category = data.category as any;
    if (data.isVeg !== undefined) item.isVeg = data.isVeg;
    if (data.isAvailable !== undefined) item.isAvailable = data.isAvailable;
    if (data.sortOrder !== undefined) item.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) item.isActive = data.isActive;

    await item.save();
    await cache.delByPattern("menu:*");
    return item;
  }

  async deleteMenuItem(id: string) {
    validateId(id);
    const item = await MenuItem.findById(id);
    if (!item) throw new AppError("Menu item not found", 404);
    item.isActive = false;
    await item.save();
    await cache.delByPattern("menu:*");
  }
}

export const menuItemService = new MenuItemService();
