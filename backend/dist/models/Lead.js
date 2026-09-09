"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leadNoteSchema = new mongoose_1.default.Schema({
    author: { type: String, default: "Sales Team" },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ["note", "call", "email", "stage_change"],
        default: "note",
    },
    createdAt: { type: Date, default: Date.now },
});
const leadSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "Individual" },
    jobTitle: { type: String, default: "Lead Contact" },
    dealValue: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: {
        type: String,
        enum: [
            "New",
            "Contacted",
            "In Progress",
            "Qualified",
            "Proposal Sent",
            "Won",
            "Lost",
        ],
        default: "New",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Medium",
    },
    source: {
        type: String,
        enum: [
            "Website",
            "LinkedIn",
            "Instagram",
            "Google Ads",
            "Referral",
            "Cold Outreach",
            "Event",
            "Other",
        ],
        default: "Website",
    },
    assignedTo: { type: String, default: "Priya Sharma" },
    leadScore: { type: Number, default: 50 },
    leadScoreCategory: {
        type: String,
        enum: ["Hot", "Warm", "Cold"],
        default: "Warm",
    },
    scoreFactors: { type: [String], default: [] },
    followUpDate: { type: Date, default: null },
    tags: { type: [String], default: [] },
    notes: { type: [leadNoteSchema], default: [] },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Lead", leadSchema);
