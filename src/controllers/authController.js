import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import {
  sendResetPasswordEmail,
  sendEmployeeCredentialsEmail,
} from "../services/emailService.js";
import { validationResult } from "express-validator";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

export const register = async (req, res, next) => {
  try {
    // check validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { fullName, storeName, phoneNumber, email, password } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "Email already exists", 400);
    }

    // create user
    const user = await User.create({
      fullName,
      storeName,
      phoneNumber,
      email,
      password,
    });

    // generate token
    const token = generateToken(user.id);

    return successResponse(
      res,
      "Registration successful",
      { user, token },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // check validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, "Incorrect email or password", 401);
    }

    // Check if user is Active
    if (!user.isActive) {
      return errorResponse(
        res,
        "Your account has been deactivated. Contact support.",
        403,
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user.id);

    return successResponse(res, "Login Successful", {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    // check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { fullName, phoneNumber, email, password, role } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "Email already exists", 400);
    }

    // create employee
    const employee = await User.create({
      fullName,
      phoneNumber,
      email,
      password,
      role,
    });

    // send email with credentials
    await sendEmployeeCredentialsEmail(email, fullName, password, role);

    return successResponse(
      res,
      "Employee created successfully",
      { employee },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    // check validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, "No user found with that email", 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    try {
      await sendResetPasswordEmail(user.email, resetToken);

      return successResponse(res, "Reset token sent to email");
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return errorResponse(
        res,
        "Error sending email. Please try again later.",
        500,
      );
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return errorResponse(res, "Token is invalid or has expired", 400);
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Generate new token
    const newToken = generateToken(user.id);

    return successResponse(res, "Password reset successful", {
      user,
      token: newToken,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!(await user.comparePassword(currentPassword))) {
      return errorResponse(res, "Current password is incorrect", 401);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};
