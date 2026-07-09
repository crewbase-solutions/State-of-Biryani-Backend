import { Router } from "express";
import { variationController } from "./variation.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { addVariationSchema, updateVariationSchema } from "../../core/validators/schemas.js";

const router = Router();

router.post("/addVariation/:id", requireAuth("ADMIN", "MANAGER"), validate(addVariationSchema), variationController.add);
router.patch("/updateVariation/:id", requireAuth("ADMIN", "MANAGER"), validate(updateVariationSchema), variationController.update);
router.delete("/deleteVariation/:id", requireAuth("ADMIN"), variationController.delete);

export default router;
