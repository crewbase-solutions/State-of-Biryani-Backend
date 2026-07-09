import { Router } from "express";
import { addressController } from "./address.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";
import { validate } from "../../core/middleware/validate.middleware.js";
import { addAddressSchema, updateAddressSchema } from "../../core/validators/schemas.js";

const router = Router();

router.post("/addaddress", requireAuth("CUSTOMER"), validate(addAddressSchema), addressController.add);
router.get("/getaddresses", requireAuth("CUSTOMER"), addressController.getAll);
router.get("/addresses/:id", requireAuth("CUSTOMER"), addressController.getById);
router.patch("/updateaddresses/:id", requireAuth("CUSTOMER"), validate(updateAddressSchema), addressController.update);
router.patch("/addresses/:id/default", requireAuth("CUSTOMER"), addressController.setDefault);
router.delete("/deleteaddresses/:id", requireAuth("CUSTOMER"), addressController.delete);

export default router;
