import express from "express";
import {
  createLibrary,
  getLibrary,
  getUserLibraries,
  updateLibrary,
  deleteLibrary,
  createShelf,
  getShelf,
  getLibraryShelves,
  updateShelf,
  deleteShelf,
} from "../controllers/libraryController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Library routes
router.post("/createLibrary", protect, createLibrary);
router.get("/getUserLibraries", protect, getUserLibraries);
router.get("/getLibraryById/:id", protect, getLibrary);
router.patch("/updateLibrary/:id", protect, updateLibrary);
router.delete("/deleteLibrary/:id", protect, deleteLibrary);

// Shelf routes
router.post("/createShelf/:libraryId", protect, createShelf);
router.get("/getLibraryShelves/:libraryId", protect, getLibraryShelves);
router.get("/getShelfById/:id", protect, getShelf);
router.patch("/updateShelf/:id", protect, updateShelf);
router.delete("/deleteShelf/:id", protect, deleteShelf);

export default router;
