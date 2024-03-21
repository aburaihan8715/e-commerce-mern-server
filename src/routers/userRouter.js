import express from 'express';
import {
  deleteUser,
  getUser,
  getAllUsers,
  processRegister,
  activateUserAccount,
  updateUser,
  bannedUser,
  unbannedUser,
  updatePassword,
  forgetPassword,
  resetPassword,
} from '../controllers/userController.js';
import { upload } from '../middlewares/uploadFile.js';
import {
  validateUserRegistration,
  validationForgetPasswordInput,
  validationResetPasswordInput,
  validationUpdatePasswordInput,
} from '../validators/authValidation.js';
import { runValidation } from '../validators/runValidation.js';
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth.js';
const userRouter = express.Router();

// api/users

userRouter.post('/process-register', upload.single('image'), processRegister);
// userRouter.post("/process-register", upload.single("image"), isLoggedOut, validateUserRegistration, runValidation, processRegister);

userRouter.post('/activate', isLoggedOut, activateUserAccount);

userRouter.get('/', isLoggedIn, getAllUsers);

// Note: ([0-9a-fA-F]{24}) optional but good to use
userRouter.get('/:id([0-9a-fA-F]{24})', isLoggedIn, getUser);

userRouter.delete('/:id([0-9a-fA-F]{24})', isLoggedIn, deleteUser);

userRouter.put(
  '/reset-password',
  validationResetPasswordInput,
  runValidation,
  resetPassword
);

userRouter.put(
  '/:id([0-9a-fA-F]{24})',
  upload.single('image'),
  isLoggedIn,
  updateUser
);

userRouter.put('/banned-user/:id', isLoggedIn, isAdmin, bannedUser);

userRouter.put(
  '/unbanned-user/:id([0-9a-fA-F]{24})',
  isLoggedIn,
  isAdmin,
  unbannedUser
);

userRouter.put(
  '/update-password/:id([0-9a-fA-F]{24})',
  validationUpdatePasswordInput,
  runValidation,
  isLoggedIn,
  updatePassword
);

userRouter.post(
  '/forget-password',
  validationForgetPasswordInput,
  runValidation,
  forgetPassword
);

userRouter.put(
  '/reset-password',
  validationResetPasswordInput,
  runValidation,
  resetPassword
);

export { userRouter };
