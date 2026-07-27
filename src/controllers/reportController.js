import { Op } from "sequelize";
import {
  Product,
  Sale,
  SaleItem,
  Category,
  InventoryLog,
} from "../models/index.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import sequelize from "../config/db.js";

// Dashboard Summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;

    // Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Total products
    const totalProducts = await Product.count({
      where: { storeId, isActive: true },
    });

    // Total inventory value (sum of currentStock * costPrice)
    const inventoryValueResult = await Product.findOne({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.literal("currentStock * costPrice")),
          "inventoryValue",
        ],
      ],
      where: { storeId, isActive: true },
      raw: true,
    });

    const inventoryValue = inventoryValueResult?.inventoryValue || 0;

    // Today's sales count
    const todaySalesCount = await Sale.count({
      where: {
        storeId,
        createdAt: { [Op.between]: [todayStart, todayEnd] },
      },
    });

    // Today's revenue
    const todaysRevenue = await Sale.sum("totalAmount", {
      where: {
        storeId,
        createdAt: { [Op.between]: [todayStart, todayEnd] },
      },
    });

    // Low stock count (safer approach)
    const allActiveProducts = await Product.findAll({
      where: { storeId, isActive: true },
      raw: true,
    });

    const lowStockCount = allActiveProducts.filter(
      (product) => Number(product.currentStock) <= Number(product.reorderLevel),
    ).length;

    return successResponse(res, "Dashboard summary retrieved", {
      totalProducts,
      inventoryValue,
      todaySalesCount,
      todaysRevenue: todaysRevenue || 0,
      lowStockCount,
    });
  } catch (error) {
    next(error);
  }
};

// Sales Report (daily, weekly, monthly)
export const getSalesReport = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;
    const { period = "daily", page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    let startDate = new Date();

    if (period === "daily") {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "monthly") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      return errorResponse(
        res,
        "Invalid period. Use daily, weekly or monthly",
        400,
      );
    }

    const where = {
      storeId,
      createdAt: { [Op.gte]: startDate },
    };

    // Get total revenue (all matching sales, not paginated)
    const allSales = await Sale.findAll({
      where,
      attributes: ["totalAmount"],
      raw: true,
    });

    const totalRevenue = allSales.reduce(
      (sum, sale) => sum + parseFloat(sale.totalAmount),
      0,
    );

    // Get paginated sales
    const { rows, count } = await Sale.findAndCountAll({
      where,
      include: [
        {
          model: SaleItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "sku"],
            },
          ],
        },
      ],
      limit: parsedLimit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "Sales report retrieved", {
      period,
      totalSales: count,
      totalRevenue,
      sales: rows,
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

// Best Sellers
export const getBestSellers = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;
    const { limit = 10 } = req.query;

    const bestSellers = await SaleItem.findAll({
      attributes: [
        "productId",
        [
          sequelize.fn("SUM", sequelize.col("SaleItem.quantity")),
          "totalQuantitySold",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("SaleItem.quantity * SaleItem.unitPrice"),
          ),
          "totalRevenue",
        ],
      ],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "sku"],
          where: { storeId },
        },
      ],
      group: [
        "SaleItem.productId",
        "Product.id",
        "Product.name",
        "Product.sku",
      ],
      order: [[sequelize.literal("totalQuantitySold"), "DESC"]],
      limit: parseInt(limit),
    });

    return successResponse(res, "Best sellers retrieved", { bestSellers });
  } catch (error) {
    next(error);
  }
};
