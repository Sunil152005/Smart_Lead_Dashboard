import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  deleteLead,
  updateLead,
  addNote,
  bulkDeleteLeads,
  bulkUpdateLeads,
  importLeads,
  getAnalytics,
} from "../controllers/leadController";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();

// 1. Analytical & Batch Routes (placed before /:id param match)
router.get("/analytics", protect, getAnalytics);
router.post("/import", protect, importLeads);
router.post("/bulk-delete", protect, authorizeRoles("ADMIN"), bulkDeleteLeads);
router.post("/bulk-update", protect, bulkUpdateLeads);

// 2. Base CRUD Routes
router.get("/", protect, getLeads);
router.post("/", protect, createLead);

// 3. Single Lead Parameterized Routes
router.get("/:id", protect, getLeadById);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteLead);
router.post("/:id/notes", protect, addNote);

export default router;