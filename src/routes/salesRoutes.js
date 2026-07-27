import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { salesValidation } from "../validations/salesValidation.js";
import {
  createSale,
  getAllSales,
  getSaleById,
} from "../controllers/salesController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("owner", "admin", "manager", "attendant"),
  salesValidation,
  createSale,
);

router.get("/", protect, getAllSales);

router.get("/:id", protect, getSaleById);

export default router;
