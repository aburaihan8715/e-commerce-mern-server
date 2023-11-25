import { body } from "express-validator";
// category validation
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required!")
    .isLength({ min: 3 })
    .withMessage("Category name should be at least 3 characters!"),
];

export { categoryValidation };
