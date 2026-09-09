"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const db_1 = require("../services/db");
const register = async (req, res) => {
    try {
        const { name, email, password, role = "SALES" } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        let createdUser;
        if (db_1.isMongoConnected) {
            const existing = await User_1.default.findOne({ email: normalizedEmail });
            if (existing) {
                return res.status(400).json({ message: "Email already registered." });
            }
            createdUser = await User_1.default.create({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: role.toUpperCase() === "ADMIN" ? "ADMIN" : "SALES",
            });
        }
        else {
            const existing = db_1.memoryStore.users.find((u) => u.email.toLowerCase() === normalizedEmail);
            if (existing) {
                return res.status(400).json({ message: "Email already registered." });
            }
            createdUser = {
                _id: `user_${Date.now()}`,
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: role.toUpperCase() === "ADMIN" ? "ADMIN" : "SALES",
                avatar: "",
                createdAt: new Date(),
            };
            db_1.memoryStore.users.push(createdUser);
        }
        const token = jsonwebtoken_1.default.sign({
            id: createdUser._id,
            email: createdUser.email,
            role: createdUser.role,
            name: createdUser.name,
        }, process.env.JWT_SECRET || "mysecret", { expiresIn: "7d" });
        return res.status(201).json({
            message: "Registration successful",
            token,
            role: createdUser.role,
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role,
                avatar: createdUser.avatar,
            },
        });
    }
    catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        const normalizedEmail = email.toLowerCase().trim();
        let foundUser = null;
        if (db_1.isMongoConnected) {
            foundUser = await User_1.default.findOne({ email: normalizedEmail });
        }
        else {
            foundUser = db_1.memoryStore.users.find((u) => u.email.toLowerCase() === normalizedEmail);
        }
        if (!foundUser) {
            return res.status(400).json({
                message: "No account found with this email. Try Demo Account or Register.",
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password. Please try again.",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: foundUser._id,
            email: foundUser.email,
            role: foundUser.role,
            name: foundUser.name,
        }, process.env.JWT_SECRET || "mysecret", { expiresIn: "7d" });
        return res.json({
            message: "Login successful",
            token,
            role: foundUser.role,
            user: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                avatar: foundUser.avatar,
            },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let user = null;
        if (db_1.isMongoConnected) {
            user = await User_1.default.findById(req.user.id).select("-password");
        }
        else {
            const u = db_1.memoryStore.users.find((item) => String(item._id) === String(req.user?.id));
            if (u) {
                user = {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    avatar: u.avatar,
                };
            }
        }
        if (!user) {
            return res.json({
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                    name: req.user.name || "User",
                },
            });
        }
        return res.json({ user });
    }
    catch (error) {
        console.error("GetMe Error:", error);
        return res.status(500).json({ message: "Failed to retrieve user profile." });
    }
};
exports.getMe = getMe;
