"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[API Error] Status ${statusCode}: ${message}`);
    if (err.stack && process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }
    return res.status(statusCode).json({
        success: false,
        message,
        ...(err.errors && { errors: err.errors }),
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `Resource not found: ${req.method} ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
