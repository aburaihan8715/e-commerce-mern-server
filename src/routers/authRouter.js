import express from "express";
import { loginHandler, logoutHandler, refreshTokenHandler, protectedRouteHandler } from "../controllers/authController.js";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth.js";
import { validationLoginInput } from "../validators/authValidation.js";
import { runValidation } from "../validators/runValidation.js";

const authRouter = express.Router();

// api/auth
authRouter.post("/login", validationLoginInput, runValidation, isLoggedOut, loginHandler);
authRouter.post("/logout", isLoggedIn, logoutHandler);
authRouter.get("/refresh-token", refreshTokenHandler);
authRouter.get("/protected", protectedRouteHandler);

export { authRouter };
