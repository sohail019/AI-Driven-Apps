import express from "express";
import { requireRole } from "../middlewares/rbac.middleware";
import { Role } from "../types/rbac.types";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/userValidation";
import * as authController from "../controllers/authController";

const router = express.Router();

// Public user routes
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);
router.get("/verify-email/:token", authController.verifyEmail);

// Protected user routes (require user role)
router.use(requireRole([Role.USER]));

// Add user-specific routes here
// Example: router.get("/profile", userController.getProfile);

export default router;
