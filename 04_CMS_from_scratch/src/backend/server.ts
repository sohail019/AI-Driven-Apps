import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import mongoose from "mongoose";
import musicRoutes from "./routes/musicRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import { MusicService } from "./services/musicService";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://Aniket:Aniket2408@boi-poka.kjlw1.mongodb.net/new_db?retryWrites=true&w=majority&appName=BOI-POKA"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/songs", musicRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Schedule daily playlist refresh at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const musicService = MusicService.getInstance();
    await musicService.getDailyPlaylist();
    console.log("Daily playlist refreshed successfully");
  } catch (error) {
    console.error("Failed to refresh daily playlist:", error);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
