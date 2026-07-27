import { body } from "express-validator";

const salesValidation = [
  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["cash", "transfer", "pos"])
    .withMessage("Payment method must be cash, transfer or pos"),
  body("note").optional().trim(),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required for each item"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

export { salesValidation };
