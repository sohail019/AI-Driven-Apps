import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { searchBooksFromImage } from "../controllers/imageBookSearch.controller";
import multer from "multer";

const uploadImage = multer({
  dest: "uploads/",
});

const router = Router();

// Protected route
router.post(
  "/search",
  authenticate,
  uploadImage.single("image"),
  searchBooksFromImage
);

export default router;
