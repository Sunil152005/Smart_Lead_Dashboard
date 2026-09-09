import express from "express";
import {
  createLead,
  getLeads,
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

// Specific routes before param routes
router.get("/analytics", protect, getAnalytics);
router.post("/import", protect, importLeads);
router.post("/bulk-delete", protect, authorizeRoles("ADMIN"), bulkDeleteLeads);
router.post("/bulk-update", protect, bulkUpdateLeads);

// Base CRUD
router.get("/", protect, getLeads);
router.post("/", protect, createLead);
router.post("/:id/notes", protect, addNote);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteLead);

export default router;