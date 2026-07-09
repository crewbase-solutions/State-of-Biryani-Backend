import { Router } from "express";
import { addonController } from "./addon.controller.js";
import { requireAuth } from "../../core/middleware/auth.middleware.js";

const router = Router();

router.post("/:id", requireAuth("ADMIN", "MANAGER"), addonController.add);
router.patch("/:id", requireAuth("ADMIN", "MANAGER"), addonController.update);
router.delete("/:id", requireAuth("ADMIN"), addonController.delete);

export default router;
