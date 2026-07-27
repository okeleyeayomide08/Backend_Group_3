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


export const createProductValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required'),

  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be non-negative'),

  body('costPrice')
    .isFloat({ min: 0 })
    .withMessage('Cost price must be non-negative'),

  body('currentStock')
    .isInt({ min: 0 })
    .withMessage('Stock must be non-negative'),

  body('reorderLevel')
    .isInt({ min: 0 })
    .withMessage('Reorder level must be non-negative'),
];

export const updateProductValidation = [
  body('unitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Unit price must be non-negative'),

  body('costPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost price must be non-negative'),

  body('reorderLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reorder level must be non-negative'),
];


export { categoryValidation, supplierValidation };
