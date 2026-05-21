import express from "express";

import {
  createLead,
  getLeads,
  deleteLead,
  updateLead,
} from "../controllers/leadController";

import { protect }
from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/",
  protect,
  createLead
);

router.get(
  "/",
  protect,
  getLeads
);

router.delete(
  "/:id",
  protect,
  deleteLead
);

router.put(
  "/:id",
  protect,
  updateLead
);

export default router;