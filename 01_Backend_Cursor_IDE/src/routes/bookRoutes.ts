import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createBookSchema,
  updateBookSchema,
  bookIdSchema,
} from "../validations/bookValidation";

const router = express.Router();

router.post("/", validateRequest(createBookSchema), createBook);
router.get("/", getAllBooks);
router.get("/:id", validateRequest(bookIdSchema), getBookById);
router.put(
  "/:id",
  validateRequest(bookIdSchema.merge(updateBookSchema)),
  updateBook
);
router.delete("/:id", validateRequest(bookIdSchema), deleteBook);

export default router;
