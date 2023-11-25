import express from "express";
import {
  deleteUserByIdHandler,
  getUserByIdHandler,
  getUsersHandler,
  processRegisterHandler,
  activateUserAccountHandler,
  updateUserByIdHandler,
  bannedUserByIdHandler,
  unbannedUserByIdHandler,
  updatePasswordHandler,
  forgetPasswordHandler,
  resetPasswordHandler,
} from "../controllers/userController.js";
import { upload } from "../middlewares/uploadFile.js";
import {
  validateUserRegistration,
  validationForgetPasswordInput,
  validationResetPasswordInput,
  validationUpdatePasswordInput,
} from "../validators/inputValidation.js";
import { runValidation } from "../validators/index.js";
import { isAdmin, isLoggedIn, isLoggedOut } from "../middlewares/auth.js";
const userRouter = express.Router();

// api/users
userRouter.post("/process-register", upload.single("image"), isLoggedOut, validateUserRegistration, runValidation, processRegisterHandler);

userRouter.post("/activate", isLoggedOut, activateUserAccountHandler);

userRouter.get("/", isLoggedIn, getUsersHandler);

// Note: ([0-9a-fA-F]{24}) optional but good to use
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getUserByIdHandler);

userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, deleteUserByIdHandler);

userRouter.put("/reset-password", validationResetPasswordInput, runValidation, resetPasswordHandler);

userRouter.put("/:id([0-9a-fA-F]{24})", upload.single("image"), isLoggedIn, updateUserByIdHandler);

userRouter.put("/banned-user/:id", isLoggedIn, isAdmin, bannedUserByIdHandler);

userRouter.put("/unbanned-user/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, unbannedUserByIdHandler);

userRouter.put("/update-password/:id([0-9a-fA-F]{24})", validationUpdatePasswordInput, runValidation, isLoggedIn, updatePasswordHandler);

userRouter.post("/forget-password", validationForgetPasswordInput, runValidation, forgetPasswordHandler);

userRouter.put("/reset-password", validationResetPasswordInput, runValidation, resetPasswordHandler);

export { userRouter };
