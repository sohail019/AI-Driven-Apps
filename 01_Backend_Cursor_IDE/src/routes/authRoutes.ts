import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
  superadminLogin,
  adminLogin,
} from "../controllers/authController";
import {
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  updateSocialAuthMobile,
} from "../controllers/socialAuthController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  superadminLoginSchema,
  adminLoginSchema,
} from "../validations/userValidation";
import { protect } from "../middlewares/authMiddleware";
import { refreshAccessToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  refreshToken
);
router.get("/verify-email/:token", verifyEmail);

// Superadmin routes
router.post(
  "/superadmin/login",
  validateRequest(superadminLoginSchema),
  superadminLogin
);

// Admin routes
router.post("/admin/login", validateRequest(adminLoginSchema), adminLogin);

// Auth routes
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
router.post("/logout", protect, logout);

// Social auth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, googleAuthSuccess);
router.post("/social/mobile", updateSocialAuthMobile);

export default router;
