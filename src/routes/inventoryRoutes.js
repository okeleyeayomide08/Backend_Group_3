import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  stockInValidation,
  stockOutValidation,
} from "../validations/inventoryValidation.js";
import {
  stockIn,
  stockOut,
  getAllLogs,
  getProductLogs,
  getLowStock,
} from "../controllers/inventoryController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory stock movement and logs
 */

/**
 * @swagger
 * /inventory/stock-in:
 *   post:
 *     summary: Add stock to a product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: product-uuid
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               reason:
 *                 type: string
 *                 example: New stock from supplier
 *     responses:
 *       201:
 *         description: Stock added successfully
 *       404:
 *         description: Product not found
 */
router.post(
  "/stock-in",
  protect,
  authorize("owner", "admin", "manager"),
  stockInValidation,
  stockIn,
);

/**
 * @swagger
 * /inventory/stock-out:
 *   post:
 *     summary: Remove stock from a product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - reason
 *             properties:
 *               productId:
 *                 type: string
 *                 example: product-uuid
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               reason:
 *                 type: string
 *                 example: Damaged during delivery
 *     responses:
 *       201:
 *         description: Stock removed successfully
 *       404:
 *         description: Product not found
 *       422:
 *         description: Insufficient stock
 */
router.post(
  "/stock-out",
  protect,
  authorize("owner", "admin", "manager"),
  stockOutValidation,
  stockOut,
);

/**
 * @swagger
 * /inventory/logs:
 *   get:
 *     summary: Get all inventory logs with pagination
 *     tags: [Inventory]
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
 *     responses:
 *       200:
 *         description: Inventory logs retrieved successfully
 */
router.get("/logs", protect, getAllLogs);

/**
 * @swagger
 * /inventory/logs/{productId}:
 *   get:
 *     summary: Get inventory logs for one product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Product inventory logs retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get("/logs/:productId", protect, getProductLogs);

/**
 * @swagger
 * /inventory/low-stock:
 *   get:
 *     summary: Get products with low stock
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock products retrieved successfully
 */
router.get("/low-stock", protect, getLowStock);

export default router;
