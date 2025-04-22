import express from 'express';
import {
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Password reset routes
router.post('/:role/forgot-password', forgotPassword);
router.post('/:role/reset-password', resetPassword);

// Protected routes
router.post('/:role/refresh-token', authenticate, refreshToken);
router.post('/:role/logout', authenticate, logout);

export default router; 