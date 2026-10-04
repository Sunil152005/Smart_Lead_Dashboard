"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// 1. Analytical & Batch Routes (placed before /:id param match)
router.get("/analytics", authMiddleware_1.protect, leadController_1.getAnalytics);
router.post("/import", authMiddleware_1.protect, leadController_1.importLeads);
router.post("/bulk-delete", authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)("ADMIN"), leadController_1.bulkDeleteLeads);
router.post("/bulk-update", authMiddleware_1.protect, leadController_1.bulkUpdateLeads);
// 2. Base CRUD Routes
router.get("/", authMiddleware_1.protect, leadController_1.getLeads);
router.post("/", authMiddleware_1.protect, leadController_1.createLead);
// 3. Single Lead Parameterized Routes
router.get("/:id", authMiddleware_1.protect, leadController_1.getLeadById);
router.put("/:id", authMiddleware_1.protect, leadController_1.updateLead);
router.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)("ADMIN"), leadController_1.deleteLead);
router.post("/:id/notes", authMiddleware_1.protect, leadController_1.addNote);
exports.default = router;
