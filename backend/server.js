import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Import models to ensure they're registered with Mongoose
import "./models/user.js";
import "./models/faq.js";
import "./models/feedback.js";
import "./models/reach_us.js";
import "./models/review.js";
import "./models/refresh_token.js";
import "./models/booking.js";
import "./models/favorite.js";
import "./models/file.js";
import "./models/notification.js";

import connectDB from "./config/db.js";
import apiRouter from "./routes/api_route.js";
// Import socket initialization
import { initializeSocket } from "./socket.js";

// __filename and __dirname are not available in ES modules by default.
// Derive them from import.meta.url so legacy code using __dirname works.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || [
      "http://localhost:8081",
      "http://10.97.115.2:8081",
      "http://localhost:8000",
      "https://alorahs.app",
      "http://192.168.31.147:8081",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400, // cache preflight response for 1 day
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes - keep before frontend static serving
app.use("/api", apiRouter);

// Health check route
app.get("/health", (req, res) => {
  const connectionState = mongoose.connection.readyState;
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.status(200).json({
    status: "OK",
    dbStatus: statusMap[connectionState] || "Unknown",
    socketConnections: global.connectedUsers ? global.connectedUsers.size : 0,
  });
});

// 404 handler (after all routes)
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Connect DB and start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
