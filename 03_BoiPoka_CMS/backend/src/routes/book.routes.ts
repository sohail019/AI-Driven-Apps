import { Router } from 'express';
import {
  searchBooks,
  addMasterBook,
  createLibrary,
  addBookToLibrary,
  getUserBooks,
  updateBookProgress,
} from '../controllers/book.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/search', searchBooks);

// Protected routes
router.post('/master', authenticate, addMasterBook);
router.post('/library', authenticate, createLibrary);
router.post('/library/book', authenticate, addBookToLibrary);
router.get('/library/books', authenticate, getUserBooks);
router.patch('/book/:userBookId/progress', authenticate, updateBookProgress);

export default router; 