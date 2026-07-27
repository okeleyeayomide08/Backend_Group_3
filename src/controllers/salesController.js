import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { Product, Sale, SaleItem, InventoryLog } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import sequelize from "../config/db.js";

// Record a sale (atomic transaction)
export const createSale = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { paymentMethod, note, items } = req.body;
    const storeId = req.user.storeId;
    const userId = req.user.id;

    let totalAmount = 0;
    const saleItems = [];
    const lowStockWarnings = [];

    // 1. Verify stock for ALL items first
    for (const item of items) {
      const product = await Product.findOne({
        where: { id: item.productId, storeId, isActive: true },
        transaction: t,
      });

      if (!product) {
        await t.rollback();
        return errorResponse(res, `Product not found: ${item.productId}`, 404);
      }

      if (item.quantity > product.currentStock) {
        await t.rollback();
        return errorResponse(
          res,
          `Insufficient stock for ${product.name}. Available: ${product.currentStock}`,
          422,
        );
      }

      saleItems.push({
        product,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(product.unitPrice),
      });

      totalAmount += parseFloat(product.unitPrice) * parseInt(item.quantity);
    }

    // 2. Create sale record
    const sale = await Sale.create(
      {
        userId,
        storeId,
        totalAmount,
        paymentMethod,
        note,
      },
      { transaction: t },
    );

    // 3. Create sale items, deduct stock, create logs
    const createdItems = [];

    for (const item of saleItems) {
      // Create sale item
      const saleItem = await SaleItem.create(
        {
          saleId: sale.id,
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
        { transaction: t },
      );

      createdItems.push(saleItem);

      // Deduct stock
      const previousStock = item.product.currentStock;
      item.product.currentStock = previousStock - item.quantity;
      await item.product.save({ transaction: t });

      // Create inventory log
      await InventoryLog.create(
        {
          productId: item.product.id,
          userId,
          storeId,
          type: "SALE",
          quantity: item.quantity,
          reason: `Sale #${sale.id}`,
          previousStock,
          newStock: item.product.currentStock,
        },
        { transaction: t },
      );

      // Check low stock
      if (item.product.currentStock <= item.product.reorderLevel) {
        lowStockWarnings.push({
          productId: item.product.id,
          name: item.product.name,
          currentStock: item.product.currentStock,
          reorderLevel: item.product.reorderLevel,
        });
      }
    }

    // 4. Commit transaction — everything succeeded
    await t.commit();

    return successResponse(
      res,
      "Sale recorded successfully",
      {
        sale: {
          id: sale.id,
          totalAmount: sale.totalAmount,
          paymentMethod: sale.paymentMethod,
          note: sale.note,
          items: createdItems,
        },
        ...(lowStockWarnings.length > 0 && {
          lowStockWarnings,
        }),
      },
      201,
    );
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// Get all sales
export const getAllSales = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;

    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const where = { storeId };

    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate + "T23:59:59")],
      };
    }

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

    return successResponse(res, "Sales retrieved", {
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

// Get single sale with items
export const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const storeId = req.user.storeId;

    const sale = await Sale.findOne({
      where: { id, storeId },
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
    });

    if (!sale) {
      return errorResponse(res, "Sale not found", 404);
    }

    return successResponse(res, "Sale retrieved", { sale });
  } catch (error) {
    next(error);
  }
};
