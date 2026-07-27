import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getDashboardSummary,
  getSalesReport,
  getBestSellers,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/dashboard/summary", protect, getDashboardSummary);

router.get("/reports/sales", protect, getSalesReport);

router.get("/reports/best-sellers", protect, getBestSellers);

export default router;
