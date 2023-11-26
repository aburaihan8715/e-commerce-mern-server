import express from "express";
import { seedUsers, seedProducts } from "../controllers/seedController.js";
import { upload } from "../middlewares/uploadFile.js";

const seedRouter = express.Router();

seedRouter.get("/users", upload.single("image"), seedUsers);
seedRouter.get("/products", upload.single("image"), seedProducts);

export { seedRouter };
