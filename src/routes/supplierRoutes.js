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

router.post(
  "/",
  protect,
  authorize("owner", "admin", "manager"),
  supplierValidation,
  createSupplier,
);

router.get("/", protect, getAllSuppliers);

router.get("/:id", protect, getSupplierById);

router.put(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  supplierValidation,
  updateSupplier,
);

router.delete(
  "/:id",
  protect,
  authorize("owner", "admin", "manager"),
  deleteSupplier,
);

export default router;
