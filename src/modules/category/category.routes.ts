import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../../core/validators/schemas.js";

const router = Router();

router.get("/getcategory", categoryController.getCategories);
router.get("/getcategory/:id", categoryController.getCategory);

router.post(
  "/addcategory",
  requireAuth("ADMIN", "MANAGER"),
  validate(createCategorySchema),
  categoryController.createCategory,
);

router.patch(
  "/updatecategory/:id",
  requireAuth("ADMIN", "MANAGER"),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete(
  "/deletecategory/:id",
  requireAuth("ADMIN", "MANAGER"),
  categoryController.deleteCategory,
);

export default router;
