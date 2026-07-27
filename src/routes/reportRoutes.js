import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getDashboardSummary,
  getSalesReport,
  getBestSellers,
} from "../controllers/reportController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Dashboard and business reports
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 */
router.get("/dashboard/summary", protect, getDashboardSummary);

/**
 * @swagger
 * /reports/sales:
 *   get:
 *     summary: Get sales report by period with pagination
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         example: daily
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Sales report retrieved successfully
 */
router.get("/reports/sales", protect, getSalesReport);

/**
 * @swagger
 * /reports/best-sellers:
 *   get:
 *     summary: Get best selling products
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Best sellers retrieved successfully
 */
router.get("/reports/best-sellers", protect, getBestSellers);

export default router;
