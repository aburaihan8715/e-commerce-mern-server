import express from "express";
import { getSeedUsers } from "../controllers/seedUserController.js";

const seedUserRouter = express.Router();

seedUserRouter.get("/users", getSeedUsers);

export { seedUserRouter };
