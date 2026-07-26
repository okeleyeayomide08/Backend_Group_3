import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Category from "../models/Category.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { name, description } = req.body;

    const storeId = req.user.storeId;

    const existingCategory = await Category.findOne({
      where: {
        name,
        storeId,
      },
    });

    if (existingCategory) {
      return errorResponse(res, "Category already exists", 409);
    }

    const category = await Category.create({
      name,
      description,
      storeId,
    });

    return successResponse(res, "Category created", { category }, 201);
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;

    const categories = await Category.findAll({ where: { storeId } });

    return successResponse(res, "All categories retrieved", { categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const storeId = req.user.storeId;

    const category = await Category.findOne({
      where: {
        id,
        storeId,
      },
    });

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    return successResponse(res, "Category retrieved", { category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const id = req.params.id;
    const { name, description } = req.body;
    const storeId = req.user.storeId;

    const category = await Category.findOne({ where: { id, storeId } });

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    const existingCategory = await Category.findOne({
      where: {
        name,
        storeId,
        id: { [Op.ne]: id },
      },
    });

    if (existingCategory) {
      return errorResponse(res, "Category name already exists", 409);
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    return successResponse(res, "Category Updated", { category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const storeId = req.user.storeId;

    const category = await Category.findOne({ where: { id, storeId } });

    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    await category.destroy();

    return successResponse(res, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
