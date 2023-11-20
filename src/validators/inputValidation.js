import { body } from "express-validator";
// registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name should be within (3-30) characters!"),

  body("email").notEmpty().withMessage("Email is required!").isEmail().withMessage("Invalid email address!"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters!")
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
    .withMessage("Password should be at least one digit,one lowercase letter, one uppercase letter,one special character."),

  body("address").trim().notEmpty().withMessage("Address is required!").isLength({ min: 3 }).withMessage("Address should be minimum 3 characters!"),

  body("phone").trim().notEmpty().withMessage("Phone is required!"),

  body("image").optional().isString(),
];

// login validation

export { validateUserRegistration };
