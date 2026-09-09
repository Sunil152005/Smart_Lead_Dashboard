"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const db_1 = require("./services/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/leads", leadRoutes_1.default);
// Health check endpoint
app.get("/api/health", (_req, res) => {
    res.json({
        status: "healthy",
        environment: process.env.NODE_ENV || "development",
        database: db_1.isMongoConnected ? "MongoDB Atlas (Live)" : "Resilient High-Performance Store (Active)",
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
    await (0, db_1.initDatabase)();
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
