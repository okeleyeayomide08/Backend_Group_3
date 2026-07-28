import { param, body } from "express-validator";

const stockInValidation = [
  param("productId").trim().notEmpty().withMessage("ProductId is required"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must not be less than 1"),
  body("reason").optional(),
];

const stockOutValidation = [
  param("productId").trim().notEmpty().withMessage("ProductId is required"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must not be less than 1"),
  body("reason").trim().notEmpty().withMessage("Reason is required"),
];

export { stockInValidation, stockOutValidation };
