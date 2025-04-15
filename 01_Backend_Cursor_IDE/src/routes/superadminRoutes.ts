import express from "express";
import { requireRole } from "../middlewares/rbac.middleware";
import { Role } from "../types/rbac.types";
import { validateRequest } from "../middlewares/validateRequest";
import { adminValidation } from "../validations/adminValidation";
import adminController from "../controllers/adminController";
import {
  registerSuperAdminSchema,
  loginSuperAdminSchema,
} from "../validations/superadminValidation";
import { superadminController } from "../controllers/superadminController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Public superadmin routes
router.post(
  "/register",
  validateRequest(registerSuperAdminSchema),
  superadminController.register
);
router.post(
  "/login",
  validateRequest(loginSuperAdminSchema),
  superadminController.login
);

// Protected superadmin routes
router.use(protect);
router.use(requireRole([Role.SUPERADMIN]));

// Create admin
router.post(
  "/admins",
  validateRequest(adminValidation.createAdmin),
  adminController.createAdmin
);

// Update admin
router.patch(
  "/admins/:id",
  validateRequest(adminValidation.updateAdmin),
  adminController.updateAdmin
);

// Get all admins
router.get("/admins", adminController.getAdmins);

// Get admin by ID
router.get("/admins/:id", adminController.getAdminById);

export default router;
