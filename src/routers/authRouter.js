import express from "express";
import { loginHandler, logoutHandler } from "../controllers/authController.js";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth.js";
import { validationLoginInput } from "../validators/inputValidation.js";
import { runValidation } from "../validators/index.js";

const authRouter = express.Router();

// api/users
authRouter.post("/login", validationLoginInput, runValidation, isLoggedOut, loginHandler);
authRouter.post("/logout", isLoggedIn, logoutHandler);

export { authRouter };
