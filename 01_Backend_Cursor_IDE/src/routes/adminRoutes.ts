import express from "express";
import adminController from "../controllers/adminController";
import { requireRole, requirePermission } from "../middlewares/rbac.middleware";
import { Role, Permission } from "../types/rbac.types";
import { validateRequest } from "../middlewares/validateRequest";
import {
  adminLoginSchema,
  adminValidation,
} from "../validations/adminValidation";
import {
  loginAdmin,
  refreshAdminToken,
  logoutAdmin,
} from "../controllers/adminAuthController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Public admin routes (no authentication required)
router.post("/login", validateRequest(adminLoginSchema), loginAdmin);
router.post("/refresh-token", refreshAdminToken);
router.post("/logout", logoutAdmin);

// Protected admin routes (require superadmin role)
router.post(
  "/",
  protect,
  requireRole([Role.SUPERADMIN]),
  validateRequest(adminValidation.createAdmin),
  adminController.createAdmin
);

router.patch(
  "/:id",
  protect,
  requireRole([Role.SUPERADMIN]),
  validateRequest(adminValidation.updateAdmin),
  adminController.updateAdmin
);

router.get(
  "/",
  protect,
  requireRole([Role.SUPERADMIN]),
  adminController.getAdmins
);

router.get(
  "/:id",
  protect,
  requireRole([Role.SUPERADMIN]),
  adminController.getAdminById
);

export default router;
