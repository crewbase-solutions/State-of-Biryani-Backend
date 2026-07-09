import slugify from "slugify";
import { Category } from "./category.model.js";
import { MenuItem } from "../menuItem/menuItem.model.js";
import { AppError } from "../../core/errors/AppError.js";
import { cache } from "../../lib/cache/cache.js";

const CAT_TTL = 120;
const CAT_KEY = (page: number, limit: number) => `categories:${page}:${limit}`;

class CategoryService {
  async createCategory(data: {
    name: string;
    description?: string;
    image?: string;
    sortOrder?: number;
  }) {
    const slug = slugify(data.name, { lower: true, strict: true, trim: true });

    const exists = await Category.findOne({
      $or: [{ name: data.name }, { slug }],
    });
    if (exists) throw new AppError("Category already exists", 409);

    await Category.create({
      name: data.name,
      slug,
      description: data.description,
      image: data.image,
      sortOrder: data.sortOrder ?? 0,
    });

    await cache.delByPattern("categories:*");
    return await Category.findOne({ slug });
  }

  async getCategories(page = 1, limit = 20) {
    const key = CAT_KEY(page, limit);
    const cached = await cache.get(key);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Category.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).skip(skip).limit(limit),
      Category.countDocuments({ isActive: true }),
    ]);
    const result = { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
    await cache.set(key, result, CAT_TTL);
    return result;
  }

  async getCategory(id: string) {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Category not found", 404);
    return category;
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Category not found", 404);

    if (data.name && data.name !== category.name) {
      const slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
      });

      const exists = await Category.findOne({
        $or: [{ name: data.name }, { slug }],
        _id: { $ne: id },
      });
      if (exists) throw new AppError("Category already exists", 409);

      category.name = data.name;
      category.slug = slug;
    }

    if (data.description !== undefined) category.description = data.description;
    if (data.image !== undefined) category.image = data.image;
    if (data.sortOrder !== undefined) category.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) category.isActive = data.isActive;

    await category.save();
    await cache.delByPattern("categories:*");
    return category;
  }

  async deleteCategory(id: string) {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Category not found", 404);

    const menuItems = await MenuItem.countDocuments({ category: id, isActive: true });
    if (menuItems > 0) throw new AppError("Cannot delete category because it contains menu items", 400);

    category.isActive = false;
    await category.save();
    await cache.delByPattern("categories:*");
  }
}

export const categoryService = new CategoryService();
