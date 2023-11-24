import express from "express";
import { getSeedUsers } from "../controllers/seedUserController.js";
import { upload } from "../middlewares/uploadFile.js";

const seedUserRouter = express.Router();

seedUserRouter.get("/users", upload.single("image"), getSeedUsers);

export { seedUserRouter };
