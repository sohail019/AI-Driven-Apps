import { Router } from 'express';
import {
  registerSuperAdmin,
  loginSuperAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  activateAdmin,
  deactivateAdmin,
  getAdminById,
  getAllAdmins,
} from '../controllers/superAdmin.controller';
import { authenticate, requireSuperAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerSuperAdmin);
router.post('/login', loginSuperAdmin);

// Protected routes (require super-admin authentication)
router.use(authenticate, requireSuperAdmin);

// Admin management routes
router.post('/admins', createAdmin);
router.put('/admins/:adminId', updateAdmin);
router.delete('/admins/:adminId', deleteAdmin);
router.patch('/admins/:adminId/activate', activateAdmin);
router.patch('/admins/:adminId/deactivate', deactivateAdmin);
router.get('/admins/:adminId', getAdminById);
router.get('/admins', getAllAdmins);

export default router; 