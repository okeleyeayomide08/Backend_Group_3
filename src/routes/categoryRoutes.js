import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { categoryValidation } from "../validations/productValidation.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("owner", "admin", "manager"),
  categoryValidation,
  createCategory,
);

router.get("/", protect, getAllCategories);

router.get("/:id", protect, getCategoryById);

router.put(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  categoryValidation,
  updateCategory,
);

router.delete(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  deleteCategory,
);

export default router;
