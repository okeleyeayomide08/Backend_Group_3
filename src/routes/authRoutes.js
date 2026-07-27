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

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new business owner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - storeName
 *               - phoneNumber
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Owner
 *               storeName:
 *                 type: string
 *                 example: John Electronics
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               email:
 *                 type: string
 *                 example: john@business.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error or email already exists
 */
router.post("/register", registerValidation, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@business.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Incorrect email or password
 *       403:
 *         description: Account deactivated
 */
router.post("/login", loginValidation, login);

/**
 * @swagger
 * /auth/create-employee:
 *   post:
 *     summary: Create a new employee (Owner & Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Manager
 *               phoneNumber:
 *                 type: string
 *                 example: "08098765432"
 *               email:
 *                 type: string
 *                 example: jane@business.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, attendant]
 *                 example: manager
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error or email exists
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Role not authorized
 */
router.post(
  "/create-employee",
  protect,
  authorize("owner", "admin"),
  createEmployeeValidation,
  createEmployee,
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@business.com
 *     responses:
 *       200:
 *         description: Reset token sent to email
 *       404:
 *         description: No user found with that email
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token from email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Token invalid or expired
 */
router.post("/reset-password/:token", passwordValidation, resetPassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password (any logged in user)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Current password is incorrect
 */
router.post(
  "/change-password",
  protect,
  changePasswordValidation,
  changePassword,
);

export default router;
