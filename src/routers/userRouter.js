import express from "express";
import { deleteUserById, getUserById, getUsers, processRegister, activateUserAccount, updateUserById } from "../controllers/userController.js";
import { upload } from "../middlewares/uploadFile.js";
import { validateUserRegistration } from "../validators/inputValidation.js";
import { runValidation } from "../validators/index.js";
const userRouter = express.Router();

// GET: api/users
userRouter.post("/process-register", upload.single("image"), validateUserRegistration, runValidation, processRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put("/:id", upload.single("image"), updateUserById);

export { userRouter };
