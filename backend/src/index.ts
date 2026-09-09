import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";
import { initDatabase, isMongoConnected } from "./services/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    database: isMongoConnected ? "MongoDB Atlas (Live)" : "Resilient High-Performance Store (Active)",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Smart Lead Dashboard CRM Backend is running.",
    version: "2.0.0",
    healthCheck: "/api/health",
  });
});

// Start Server and Database initialization
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Smart Lead Dashboard CRM Server`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
}

startServer().catch((err) => {
  console.error("Fatal Server Startup Error:", err);
});