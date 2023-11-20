import express from "express";
import { deleteUserById, getUserById, getUsers, processRegister, activateUserAccount } from "../controllers/userController.js";
const userRouter = express.Router();

// GET: api/users
userRouter.post("/process-register", processRegister);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

export { userRouter };
