import express from "express";
import { getUser, getUsers } from "../controllers/userController.js";
const userRouter = express.Router();

// GET: api/users
userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);

export { userRouter };
