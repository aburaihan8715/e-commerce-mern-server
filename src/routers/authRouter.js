import express from 'express';

import {
  loginController,
  logoutController,
  refreshToken,
  protectedRoute,
} from '../controllers/authController.js';
import { isLoggedIn, isLoggedOut } from '../middlewares/auth.js';
import { validationLoginInput } from '../validators/authValidation.js';
import { runValidation } from '../validators/runValidation.js';

const authRouter = express.Router();

authRouter.post(
  '/login',
  validationLoginInput,
  runValidation,
  isLoggedOut,
  loginController
);
authRouter.post('/logout', isLoggedIn, logoutController);
authRouter.get('/refresh-token', refreshToken);
authRouter.get('/protected', protectedRoute);

export { authRouter };
