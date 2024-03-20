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

// registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3, max: 30 })
    .withMessage('Name should be within (3-30) characters!'),

  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Invalid email address!'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters!')
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
    .withMessage(
      'Password should be at least one digit,one lowercase letter, one uppercase letter,one special character.'
    ),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required!')
    .isLength({ min: 3 })
    .withMessage('Address should be minimum 3 characters!'),

  body('phone').trim().notEmpty().withMessage('Phone is required!'),

  // image as string
  // body("image").optional().isString(),

  // image as buffer
  body('image')
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error('Image is required!');
      }
      return true;
    })
    .withMessage('Image is required!'),
];

// login validation
const validationLoginInput = [
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Invalid email address!'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters!')
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
    .withMessage(
      'Password should be at least one digit,one lowercase letter, one uppercase letter,one special character.'
    ),
];

// update password validation
const validationUpdatePasswordInput = [
  body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('Old Password is required. Enter your old password!')
    .isLength({ min: 6 })
    .withMessage('Old Password should be at least 6 characters!')
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
    .withMessage(
      'Password should be at least one digit,one lowercase letter, one uppercase letter,one special character.'
    ),

  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New Password is required. Enter your new password!')
    .isLength({ min: 6 })
    .withMessage('New Password should be at least 6 characters!')
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
    .withMessage(
      'Password should be at least one digit,one lowercase letter, one uppercase letter,one special character.'
    ),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword)
      throw new Error('Password did not match!');
    return true;
  }),
];

// forget password validation
const validationForgetPasswordInput = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Invalid email address!'),
];

// forget password validation
const validationResetPasswordInput = [
  body('token').trim().notEmpty().withMessage('Token is missing!'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required. Enter your password!')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters!')
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/)
    .withMessage(
      'Password should be at least one digit,one lowercase letter, one uppercase letter,one special character.'
    ),
];

export {
  validateUserRegistration,
  validationLoginInput,
  validationUpdatePasswordInput,
  validationForgetPasswordInput,
  validationResetPasswordInput,
};
