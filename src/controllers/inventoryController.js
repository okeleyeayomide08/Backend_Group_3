import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { Product, InventoryLog, User, Category } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import sequelize from "../config/db.js";

export const stockIn = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { productId } = req.params;
    const { quantity, reason } = req.body;
    const storeId = req.user.storeId;
    const userId = req.user.id;

    const product = await Product.findOne({
      where: { id: productId, storeId, isActive: true },
    });

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    const previousStock = product.currentStock;
    product.currentStock = previousStock + parseInt(quantity);
    await product.save();

    const inventoryLog = await InventoryLog.create({
      productId: product.id,
      userId,
      storeId,
      type: "IN",
      quantity: parseInt(quantity),
      reason,
      previousStock,
      newStock: product.currentStock,
    });

    return successResponse(
      res,
      "Stock added successfully",
      {
        product: {
          id: product.id,
          name: product.name,
          previousStock,
          currentStock: product.currentStock,
        },
        inventoryLog,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const stockOut = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { productId } = req.params;
    const { quantity, reason } = req.body;
    const storeId = req.user.storeId;
    const userId = req.user.id;

    const product = await Product.findOne({
      where: { id: productId, storeId, isActive: true },
    });

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    if (parseInt(quantity) > product.currentStock) {
      return errorResponse(
        res,
        `Insufficient stock. Current stock: ${product.currentStock}`,
        422,
      );
    }

    const previousStock = product.currentStock;
    product.currentStock = previousStock - parseInt(quantity);
    await product.save();

    const inventoryLog = await InventoryLog.create({
      productId: product.id,
      userId,
      storeId,
      type: "OUT",
      quantity: parseInt(quantity),
      reason,
      previousStock,
      newStock: product.currentStock,
    });

    const isLowStock = product.currentStock <= product.reorderLevel;

    return successResponse(
      res,
      "Stock removed successfully",
      {
        product: {
          id: product.id,
          name: product.name,
          previousStock,
          currentStock: product.currentStock,
        },
        inventoryLog,
        ...(isLowStock && {
          warning: `⚠️ Low stock alert! Current: ${product.currentStock}, Reorder level: ${product.reorderLevel}`,
        }),
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const getAllLogs = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;

    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const { rows, count } = await InventoryLog.findAndCountAll({
      where: { storeId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "currentStock"],
        },
        {
          model: User,
          attributes: ["id", "fullName"],
        },
      ],
      limit: parsedLimit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Inventory logs retrieved", {
      logs: rows,
      pagination: {
        total: count,
        page: parsedPage,
        pages: Math.ceil(count / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductLogs = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const storeId = req.user.storeId;

    const product = await Product.findOne({
      where: { id: productId, storeId, isActive: true },
    });

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const { rows, count } = await InventoryLog.findAndCountAll({
      where: { productId, storeId },
      include: [
        {
          model: User,
          attributes: ["id", "fullName"],
        },
      ],
      limit: parsedLimit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Product inventory logs retrieved", {
      product: {
        id: product.id,
        name: product.name,
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
      },
      logs: rows,
      pagination: {
        total: count,
        page: parsedPage,
        pages: Math.ceil(count / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;

    const products = await Product.findAll({
      where: {
        storeId,
        isActive: true,
        currentStock: {
          [Op.lte]: sequelize.col("reorderLevel"),
        },
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
      order: [["currentStock", "ASC"]],
    });

    return successResponse(res, "Low stock products retrieved", {
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};
