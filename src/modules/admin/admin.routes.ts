import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { createUserSchema } from "../../core/validators/schemas.js";

const router = Router();

// ADMIN only — create manager or another admin
router.post("/managers", requireAuth("ADMIN"), validate(createUserSchema), adminController.createManager);
router.post("/admins", requireAuth("ADMIN"), validate(createUserSchema), adminController.createAdmin);

// ADMIN or MANAGER — create delivery
router.post("/delivery", requireAuth("ADMIN", "MANAGER"), validate(createUserSchema), adminController.createDelivery);

// ADMIN only — view and delete users
router.get("/users", requireAuth("ADMIN"), adminController.getUsers);
router.delete("/users/:id", requireAuth("ADMIN"), adminController.deleteUser);

export default router;
