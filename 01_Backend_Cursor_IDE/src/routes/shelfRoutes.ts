import express from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { shelfValidation } from "../validations/shelfValidation";
import { shelfController } from "../controllers/shelfController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Create a new shelf
router.post(
  "/",
  protect,
  validateRequest(shelfValidation.createShelfSchema),
  shelfController.createShelf
);

// Get all shelves for a library
router.get("/library/:libraryId", protect, shelfController.getShelves);

// Get a single shelf
router.get("/:id", protect, shelfController.getShelf);

// Update a shelf
router.put(
  "/:id",
  protect,
  validateRequest(shelfValidation.updateShelfSchema),
  shelfController.updateShelf
);

// Delete a shelf
router.delete("/:id", protect, shelfController.deleteShelf);

export default router;
