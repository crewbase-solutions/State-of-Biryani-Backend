import { Router } from "express";
import { customerController } from "./customer.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { completeCustomerProfileSchema, updateCustomerProfileSchema } from "../../core/validators/schemas.js";

const router = Router();

router.get("/me", requireAuth("CUSTOMER"), customerController.getMyProfile);
router.post("/me/complete-profile", requireAuth("CUSTOMER"), validate(completeCustomerProfileSchema), customerController.completeProfile);
router.patch("/me/update-profile", requireAuth("CUSTOMER"), validate(updateCustomerProfileSchema), customerController.updateProfile);
router.delete("/me/delete-account", requireAuth("CUSTOMER"), customerController.deleteAccount);

export default router;
