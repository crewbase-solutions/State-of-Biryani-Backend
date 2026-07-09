import { Router } from "express";
import { menuItemController } from "./menuItem.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { createMenuItemSchema, updateMenuItemSchema } from "../../core/validators/schemas.js";

const router = Router();

router.post("/addmenu", requireAuth("ADMIN", "MANAGER"), validate(createMenuItemSchema), menuItemController.create);
router.get("/getmenu", menuItemController.getAll);
router.patch("/updatemenu/:id", requireAuth("ADMIN", "MANAGER"), validate(updateMenuItemSchema), menuItemController.update);
router.delete("/deletemenu/:id", requireAuth("ADMIN"), menuItemController.delete);

export default router;
