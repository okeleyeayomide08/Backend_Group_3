import { Product, Category } from '../models/index.js';
import { Op } from 'sequelize';

// Utility: generate SKU (e.g., CAT-12345)
const generateSKU = (categoryId) => `CAT${categoryId}-${Date.now().toString().slice(-5)}`;

// Create product
export const create = async (req, res, next) => {
  try {
    const { name, categoryId, unitPrice, costPrice, currentStock, reorderLevel } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const sku = generateSKU(categoryId);

    const product = await Product.create({
      name,
      sku,
      categoryId,
      unitPrice,
      costPrice,
      currentStock,
      reorderLevel,
      isDeleted: false
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    next(err);
  }
};

// List products with search, pagination, category filter
export const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', categoryId } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      isDeleted: false,
      ...(search && { name: { [Op.like]: `%${search}%` } }),
      ...(categoryId && { categoryId })
    };

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Category }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      products: rows
    });
  } catch (err) {
    next(err);
  }
};

// Get single product
export const getOne = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, isDeleted: false },
      include: [{ model: Category }]
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Update product
export const update = async (req, res, next) => {
  try {
    const { unitPrice, costPrice, reorderLevel } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product || product.isDeleted) return res.status(404).json({ error: 'Product not found' });

    await product.update({ unitPrice, costPrice, reorderLevel });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    next(err);
  }
};

// Soft delete product
export const softDelete = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product || product.isDeleted) return res.status(404).json({ error: 'Product not found' });

    product.isDeleted = true;
    await product.save();

    res.json({ message: 'Product archived' });
  } catch (err) {
    next(err);
  }
};
