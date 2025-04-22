import { Router } from 'express';
import {
  loginAdmin,
  resetPassword,
  requestPasswordReset,
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
  getAllBooks,
  getUserBooks,
  updateUserBookProgress,
  deleteUserBook,
  getDashboardStats,
} from '../controllers/admin.controller';
import { authenticate, requireAdmin, checkPermission } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes (require admin authentication)
router.use(authenticate, requireAdmin);

// User management routes (require specific permissions)
router.get('/users', checkPermission('get-user'), getAllUsers);
router.get('/users/:userId', checkPermission('get-user'), getUserById);
router.patch('/users/:userId/activate', checkPermission('activate-user'), activateUser);
router.patch('/users/:userId/deactivate', checkPermission('deactivate-user'), deactivateUser);

// Book management routes (require specific permissions)
router.get('/books', checkPermission('get-book'), getAllBooks);
router.get('/users/:userId/books', checkPermission('get-userbooks'), getUserBooks);
router.patch('/user-books/:userBookId/progress', checkPermission('update-userbooks'), updateUserBookProgress);
router.delete('/user-books/:userBookId', checkPermission('delete-userbooks'), deleteUserBook);

// Analytics routes (require specific permissions)
router.get('/dashboard/stats', checkPermission('get-user'), getDashboardStats);

export default router; 