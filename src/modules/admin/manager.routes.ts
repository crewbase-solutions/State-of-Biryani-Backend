import { Router } from "express";
import { managerController } from "./manager.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { completeManagerProfileSchema, updateManagerProfileSchema } from "../../core/validators/schemas.js";

const router = Router();

router.get("/me", requireAuth("MANAGER"), managerController.getProfile);
router.post("/me/complete-profile", requireAuth("MANAGER"), validate(completeManagerProfileSchema), managerController.completeProfile);
router.patch("/me/update-profile", requireAuth("MANAGER"), validate(updateManagerProfileSchema), managerController.updateProfile);

export default router;
