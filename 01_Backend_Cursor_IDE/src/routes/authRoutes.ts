import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../validations/userValidation";
import { protect } from "../middlewares/authMiddleware";
import { refreshAccessToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Auth routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get(
  "/verify-email/:token",
  validateRequest(verifyEmailSchema),
  verifyEmail
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/reset-password/:token",
  validateRequest(resetPasswordSchema),
  resetPassword
);
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  refreshAccessToken
);
router.post("/logout", protect, logout);

export default router;
