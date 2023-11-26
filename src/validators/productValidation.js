import { body } from "express-validator";
// validation elements
// .trim()
// .notEmpty()
// .withMessage("Product name is required!")
// .isLength({ min: 3, max:150 })
// .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
// .isEmail()
// .isFloat({ min: 0, })
// .isInt({ min: 1 })

// product validation
// name, description, price, quantity,category,image
const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required!")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name should be (3-150) characters!"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required!")
    .isLength({ min: 3 })
    .withMessage("Product name should be at least 3 characters!"),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product quantity is required!")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive float number!"),

  body("category").trim().notEmpty().withMessage("Product quantity is required!"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Product quantity is required!")
    .isInt({ min: 1 })
    .withMessage("Product quantity must be a positive integer!"),
];

export { productValidation };
