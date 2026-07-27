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

router.post(
  "/stock-in",
  protect,
  authorize("owner", "admin", "manager"),
  stockInValidation,
  stockIn,
);

router.post(
  "/stock-out",
  protect,
  authorize("owner", "admin", "manager"),
  stockOutValidation,
  stockOut,
);

router.get("/logs", protect, getAllLogs);

router.get("/logs/:productId", protect, getProductLogs);

router.get("/low-stock", protect, getLowStock);

export default router;
