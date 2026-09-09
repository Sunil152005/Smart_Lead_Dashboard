"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                message: "Access Denied: No authentication token provided.",
            });
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }
        const secret = process.env.JWT_SECRET || "mysecret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Authentication Failed: Invalid or expired token.",
        });
    }
};
exports.protect = protect;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role || "")) {
            return res.status(403).json({
                message: `Forbidden: Only ${roles.join(", ")} can perform this action.`,
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
