import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { salesValidation } from "../validations/salesValidation.js";
import {
  createSale,
  getAllSales,
  getSaleById,
} from "../controllers/salesController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management
 */

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Record a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - items
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, transfer, pos]
 *                 example: cash
 *               note:
 *                 type: string
 *                 example: Regular customer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: product-uuid
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Sale recorded successfully
 *       404:
 *         description: Product not found
 *       422:
 *         description: Insufficient stock
 */
router.post(
  "/",
  protect,
  authorize("owner", "admin", "manager", "attendant"),
  salesValidation,
  createSale,
);

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales with pagination and date filter
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         example: 2024-01-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         example: 2024-12-31
 *     responses:
 *       200:
 *         description: Sales retrieved successfully
 */
router.get("/", protect, getAllSales);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get single sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale retrieved successfully
 *       404:
 *         description: Sale not found
 */
router.get("/:id", protect, getSaleById);

export default router;
