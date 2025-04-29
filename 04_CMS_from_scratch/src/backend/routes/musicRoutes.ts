import { Router } from "express";
import { MusicController } from "../controllers/musicController";

const router = Router();
const musicController = new MusicController();

// Get daily curated playlist
router.get("/daily", musicController.getDailyPlaylist);

// Fetch top songs
router.post("/fetch", musicController.fetchTopSongs);

// Get playlist history
router.get("/history", musicController.getPlaylistHistory);

// Clear playlist history
router.delete("/history", musicController.clearPlaylistHistory);

// Get random song
router.get("/random", musicController.getRandomSong);

// Get song details
router.get("/:id", musicController.getSongDetails);

// Submit user feedback
// router.post("/feedback", musicController.submitFeedback);

export default router;
