// productRoutes.js
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

router.post(
  "/",
  protect,
  authorize("owner", "admin", "manager"),
  createProductValidation,
  createProduct,
);

router.get("/", protect, getAllProducts);

router.get("/:id", protect, getProductById);

router.put(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  updateProductValidation,
  updateProduct,
);

router.delete(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  deleteProduct,
);

export default router;
