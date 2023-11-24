import express from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  processRegister,
  activateUserAccount,
  updateUserById,
  bannedUserByIdHandler,
  unbannedUserByIdHandler,
  updatePasswordHandler,
} from "../controllers/userController.js";
import { upload } from "../middlewares/uploadFile.js";
import { validateUserRegistration } from "../validators/inputValidation.js";
import { runValidation } from "../validators/index.js";
import { isAdmin, isLoggedIn, isLoggedOut } from "../middlewares/auth.js";
const userRouter = express.Router();

// api/users
userRouter.post("/process-register", upload.single("image"), isLoggedOut, validateUserRegistration, runValidation, processRegister);
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);
userRouter.put("/banned-user/:id", isLoggedIn, isAdmin, bannedUserByIdHandler);
userRouter.put("/unbanned-user/:id", isLoggedIn, isAdmin, unbannedUserByIdHandler);
userRouter.put("/update-password/:id", isLoggedIn, updatePasswordHandler);

export { userRouter };
