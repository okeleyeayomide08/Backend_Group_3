import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { supplierValidation } from "../validations/productValidation.js";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Supplier management
 */

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dangote Foods Ltd
 *               contactPhone:
 *                 type: string
 *                 example: "08011112222"
 *               email:
 *                 type: string
 *                 example: supply@dangote.com
 *               address:
 *                 type: string
 *                 example: Lagos, Nigeria
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       409:
 *         description: Supplier already exists
 */
router.post(
  "/",
  protect,
  authorize("owner", "admin", "manager"),
  supplierValidation,
  createSupplier,
);

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers for this store
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 */
router.get("/", protect, getAllSuppliers);

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Get single supplier by ID
 *     tags: [Suppliers]
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
 *         description: Supplier retrieved successfully
 *       404:
 *         description: Supplier not found
 */
router.get("/:id", protect, getSupplierById);

/**
 * @swagger
 * /suppliers/{id}:
 *   patch:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dangote Group
 *               contactPhone:
 *                 type: string
 *                 example: "08011112222"
 *               email:
 *                 type: string
 *                 example: supply@dangote.com
 *               address:
 *                 type: string
 *                 example: Lagos, Nigeria
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       404:
 *         description: Supplier not found
 */
router.patch(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  supplierValidation,
  updateSupplier,
);

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
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
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  deleteSupplier,
);

export default router;
