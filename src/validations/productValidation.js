import { body } from "express-validator";

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must not be greater than 200 characters long"),
];

const supplierValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("contactPhone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact phone must be between 10 and 15 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),
];

const createProductValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("categoryId").notEmpty().withMessage("CategoryId is required"),
  body("supplierId").optional(),
  body("unitPrice")
    .notEmpty()
    .withMessage("Unit price is required")
    .isFloat({ min: 0 })
    .withMessage("Unit price must be non-negative"),
  body("costPrice")
    .notEmpty()
    .withMessage("Cost Price is required")
    .isFloat({ min: 0 })
    .withMessage("Cost price must be non-negative"),
  body("currentStock")
    .notEmpty()
    .withMessage("Current stock is required")
    .isInt({ min: 0 })
    .withMessage("Current stock must be non-negative"),
  body("reorderLevel")
    .notEmpty()
    .withMessage("Reorder level is required")
    .isInt({ min: 0 })
    .withMessage("Reorder level must be non-negative"),
];

const updateProductValidation = [
  body("name").optional(),
  body("categoryId").optional(),
  body("supplierId").optional(),
  body("unitPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Unit price must be non-negative"),
  body("costPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cost price must be non-negative"),
  body("currentStock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current stock must be non-negative"),
  body("reorderLevel")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reorder level must be non-negative"),
];

export {
  categoryValidation,
  supplierValidation,
  createProductValidation,
  updateProductValidation,
};
