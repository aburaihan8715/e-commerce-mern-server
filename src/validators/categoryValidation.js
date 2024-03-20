import { body } from 'express-validator';

// validation elements
// .trim()
// .notEmpty()
// .withMessage("Product name is required!")
// .isLength({ min: 3, max:150 })
// .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
// .isEmail()
// .isFloat({ min: 0, })
// .isInt({ min: 1 })

// category validation
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required!')
    .isLength({ min: 3 })
    .withMessage('Category name should be at least 3 characters!'),
];

export { categoryValidation };
