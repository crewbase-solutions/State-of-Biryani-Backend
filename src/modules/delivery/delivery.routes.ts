import { Router } from "express";
import { deliveryController } from "./delivery.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { completeDeliveryProfileSchema, updateDeliveryProfileSchema, updateLocationSchema } from "../../core/validators/schemas.js";

const router = Router();

router.get("/me", requireAuth("DELIVERY"), deliveryController.getProfile);
router.post("/me/complete-profile", requireAuth("DELIVERY"), validate(completeDeliveryProfileSchema), deliveryController.completeProfile);
router.patch("/me/update-profile", requireAuth("DELIVERY"), validate(updateDeliveryProfileSchema), deliveryController.updateProfile);
router.patch("/me/location", requireAuth("DELIVERY"), validate(updateLocationSchema), deliveryController.updateLocation);
router.patch("/me/availability", requireAuth("DELIVERY"), deliveryController.toggleAvailability);

export default router;
