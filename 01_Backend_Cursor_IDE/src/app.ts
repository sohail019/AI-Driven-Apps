import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bookRoutes from "./routes/bookRoutes";
import authRoutes from "./routes/authRoutes";
import libraryRoutes from "./routes/libraryRoutes";
import adminRoutes from "./routes/adminRoutes";
import superadminRoutes from "./routes/superadminRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import connectDB from "./config/database";
import dotenv from "dotenv";
import { config } from "./config/config";
import shelfRoutes from "./routes/shelfRoutes";

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/superadmin", superadminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/shelves", shelfRoutes);

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Library Management System API" });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });

    // Handle server shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
