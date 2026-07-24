import express from "express";
import {
  register,
  login,
  createEmployee,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
  createEmployeeValidation,
  passwordValidation,
  changePasswordValidation,
} from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, login);

router.post(
  "/create-employee",
  protect,
  authorize("owner", "admin"),
  createEmployeeValidation,
  createEmployee,
);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", passwordValidation, resetPassword);

router.post(
  "/change-password",
  protect,
  changePasswordValidation,
  changePassword,
);

export default router;
