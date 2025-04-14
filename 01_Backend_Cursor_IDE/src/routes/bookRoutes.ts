import express from "express";
import {
  createBookFromISBN,
  getBook,
  searchBooks,
  addBookToLibrary,
  getUserBooks,
  updateUserBookStatus,
  moveBookToShelf,
  removeBookFromLibrary,
} from "../controllers/bookController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Book routes
router.post("/", protect, createBookFromISBN);
router.get("/search", searchBooks);
router.get("/:id", getBook);

// User book routes
router.post("/library", protect, addBookToLibrary);
router.get("/library/books", protect, getUserBooks);
router.patch("/library/books/:id/status", protect, updateUserBookStatus);
router.patch("/library/books/:id/shelf", protect, moveBookToShelf);
router.delete("/library/books/:id", protect, removeBookFromLibrary);

export default router;
