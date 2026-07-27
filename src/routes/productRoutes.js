import express from "express";
import {
  createProductValidation,
  updateProductValidation,
} from "../validations/productValidation.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *               - unitPrice
 *               - costPrice
 *               - currentStock
 *               - reorderLevel
 *             properties:
 *               name:
 *                 type: string
 *                 example: Coca-Cola 50cl
 *               categoryId:
 *                 type: string
 *                 example: category-uuid
 *               supplierId:
 *                 type: string
 *                 example: supplier-uuid
 *               unitPrice:
 *                 type: number
 *                 example: 500
 *               costPrice:
 *                 type: number
 *                 example: 350
 *               currentStock:
 *                 type: integer
 *                 example: 100
 *               reorderLevel:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Product created successfully
 *       404:
 *         description: Category or supplier not found
 *       409:
 *         description: Product already exists
 */
router.post(
  "/",
  protect,
  authorize("owner", "admin", "manager"),
  createProductValidation,
  createProduct,
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination, search and category filter
 *     tags: [Products]
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
 *         name: search
 *         schema:
 *           type: string
 *         example: coca
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         example: category-uuid
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get("/", protect, getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags: [Products]
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
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", protect, getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Coca-Cola 60cl
 *               categoryId:
 *                 type: string
 *                 example: category-uuid
 *               supplierId:
 *                 type: string
 *                 example: supplier-uuid
 *               unitPrice:
 *                 type: number
 *                 example: 600
 *               costPrice:
 *                 type: number
 *                 example: 400
 *               currentStock:
 *                 type: integer
 *                 example: 120
 *               reorderLevel:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  updateProductValidation,
  updateProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Soft delete a product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  deleteProduct,
);

export default router;
