import { validationResult } from "express-validator";
import { Op } from "sequelize";
import Supplier from "../models/Supplier.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const createSupplier = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { name, contactPhone, email, address } = req.body;

    const storeId = req.user.storeId;

    const existingSupplier = await Supplier.findOne({
      where: {
        name,
        storeId,
      },
    });

    if (existingSupplier) {
      return errorResponse(res, "Supplier already exists", 409);
    }

    const supplier = await Supplier.create({
      name,
      contactPhone,
      email,
      address,
      storeId,
    });

    return successResponse(res, "Supplier created", { supplier }, 201);
  } catch (error) {
    next(error);
  }
};

const getAllSuppliers = async (req, res, next) => {
  try {
    const storeId = req.user.storeId;

    const suppliers = await Supplier.findAll({ where: { storeId } });

    return successResponse(res, "All Suppliers retrieved", { suppliers });
  } catch (error) {
    next(error);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const storeId = req.user.storeId;

    const supplier = await Supplier.findOne({
      where: {
        id,
        storeId,
      },
    });

    if (!supplier) {
      return errorResponse(res, "Supplier not found", 404);
    }

    return successResponse(res, "Supplier retrieved", { supplier });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const id = req.params.id;
    const { name, contactPhone, email, address } = req.body;
    const storeId = req.user.storeId;

    const supplier = await Supplier.findOne({ where: { id, storeId } });

    if (!supplier) {
      return errorResponse(res, "Supplier not found", 404);
    }

    const existingSupplier = await Supplier.findOne({
      where: {
        name,
        storeId,
        id: { [Op.ne]: id },
      },
    });

    if (existingSupplier) {
      return errorResponse(res, "Supplier name already exists", 409);
    }

    supplier.name = name || supplier.name;
    supplier.contactPhone = contactPhone || supplier.contactPhone;
    supplier.email = email || supplier.email;
    supplier.address = address || supplier.address;

    await supplier.save();

    return successResponse(res, "Supplier Updated", { supplier });
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const storeId = req.user.storeId;

    const supplier = await Supplier.findOne({ where: { id, storeId } });

    if (!supplier) {
      return errorResponse(res, "Supplier not found", 404);
    }

    await supplier.destroy();

    return successResponse(res, "Supplier deleted successfully");
  } catch (error) {
    next(error);
  }
};

export {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
