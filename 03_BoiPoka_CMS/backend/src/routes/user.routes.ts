import { Router } from "express";
import {
  register,
  login,
  verifyOTP,
  resendOTP,
  updateProfile,
  softDelete,
  reinstate,
  activate,
  deactivate,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Protected routes
router.put("/profile", authenticate, updateProfile);
router.post("/soft-delete/:userId", authenticate, softDelete);
router.post("/reinstate/:userId", authenticate, reinstate);
router.post("/activate/:userId", authenticate, activate);
router.post("/deactivate/:userId", authenticate, deactivate);

export default router;
