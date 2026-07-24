import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    /**
     * in headers / Bearer (authorization), add the token after login or registration
     * e.g. Bearer evyrnsdfu349fsdn349gdnsf93ew ...
     */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, "Not authorized to access this route", 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and pull out id that was added
      const user = await User.findByPk(decoded.id); // get the id and pull record from db

      if (!user) {
        return errorResponse(res, "User no longer exists", 401);
      }

      if (!user.isActive) {
        return errorResponse(res, "User account is deactivated", 401);
      }

      req.user = user;
      next();
    } catch (error) {
      return errorResponse(res, "Token is invalid or expired", 401);
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Role ${req.user.role} is not authorized to access this route`,
        403,
      );
    }
    next();
  };
};
