"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Specific routes before param routes
router.get("/analytics", authMiddleware_1.protect, leadController_1.getAnalytics);
router.post("/import", authMiddleware_1.protect, leadController_1.importLeads);
router.post("/bulk-delete", authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)("ADMIN"), leadController_1.bulkDeleteLeads);
router.post("/bulk-update", authMiddleware_1.protect, leadController_1.bulkUpdateLeads);
// Base CRUD
router.get("/", authMiddleware_1.protect, leadController_1.getLeads);
router.post("/", authMiddleware_1.protect, leadController_1.createLead);
router.post("/:id/notes", authMiddleware_1.protect, leadController_1.addNote);
router.put("/:id", authMiddleware_1.protect, leadController_1.updateLead);
router.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)("ADMIN"), leadController_1.deleteLead);
exports.default = router;
