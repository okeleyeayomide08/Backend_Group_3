import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { Product, Category, Supplier } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { generateSKU } from "../utils/skuGenerator.js";

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const {
      name,
      categoryId,
      supplierId,
      unitPrice,
      costPrice,
      currentStock,
      reorderLevel,
    } = req.body;

    const storeId = req.user.storeId;

    const existingCategory = await Category.findOne({
      where: {
        id: categoryId,
        storeId,
      },
    });

    if (!existingCategory) return errorResponse(res, "Category not found", 404);

    if (supplierId) {
      const existingSupplier = await Supplier.findOne({
        where: {
          id: supplierId,
          storeId,
        },
      });

      if (!existingSupplier) {
        return errorResponse(res, "Supplier not found", 404);
      }
    }

    const existingProduct = await Product.findOne({ where: { name, storeId } });

    if (existingProduct) {
      return errorResponse(res, "Product name already exist", 409);
    }

    const sku = generateSKU(existingCategory.name);

    const product = await Product.create({
      name,
      sku,
      categoryId,
      supplierId,
      unitPrice,
      costPrice,
      currentStock,
      reorderLevel,
      storeId,
    });

    return successResponse(res, "Product created", { product }, 201);
  } catch (error) {
    next(error);
  }
};

// List products with search, pagination, category filter
export const getAllProducts = async (req, res, next) => {
  try {
    const { storeId } = req.user;

    const { page = 1, limit = 10, search = "", categoryId } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const where = {
      storeId,
      isActive: true,
      ...(search && { name: { [Op.like]: `%${search}%` } }),
      ...(categoryId && { categoryId }),
    };

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Category }, { model: Supplier }],
      limit: parsedLimit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, "All products retrived", {
      products: rows,
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

// Get a single product
export const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const storeId = req.user.storeId;

    const product = await Product.findOne({
      where: { id, storeId, isActive: true },
      include: [{ model: Category }, { model: Supplier }],
    });

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    return successResponse(res, "Retrived product", { product });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const id = req.params.id;

    const {
      name,
      categoryId,
      supplierId,
      unitPrice,
      costPrice,
      currentStock,
      reorderLevel,
    } = req.body;

    const storeId = req.user.storeId;

    const product = await Product.findOne({
      where: {
        id,
        storeId,
        isActive: true,
      },
    });

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    if (categoryId) {
      const existingCategory = await Category.findOne({
        where: {
          id: categoryId,
          storeId,
        },
      });

      if (!existingCategory) {
        return errorResponse(res, "Category not found", 404);
      }

      product.sku = generateSKU(existingCategory.name);
    }

    if (supplierId) {
      const existingSupplier = await Supplier.findOne({
        where: {
          id: supplierId,
          storeId,
        },
      });

      if (!existingSupplier) {
        return errorResponse(res, "Supplier not found", 404);
      }
    }

    if (name) {
      const existingProduct = await Product.findOne({
        where: {
          name,
          storeId,
          id: { [Op.ne]: id },
        },
      });
      if (existingProduct) {
        return errorResponse(res, "Product name already exists", 409);
      }
    }

    product.name = name || product.name;
    product.categoryId = categoryId || product.categoryId;
    product.supplierId = supplierId || product.supplierId;
    product.unitPrice = unitPrice || product.unitPrice;
    product.costPrice = costPrice || product.costPrice;
    product.currentStock = currentStock ?? product.currentStock;
    product.reorderLevel = reorderLevel ?? product.reorderLevel;

    await product.save();

    return successResponse(res, "Product updated", { product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const storeId = req.user.storeId;

    const product = await Product.findOne({
      where: { id, storeId, isActive: true },
    });

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    product.isActive = false;

    await product.save();

    return successResponse(res, "Product deleted");
  } catch (error) {
    next(error);
  }
};
