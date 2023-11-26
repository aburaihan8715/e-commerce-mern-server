import express from "express";

import { upload } from "../middlewares/uploadFile.js";
import { createProductHandler, getProductsHandler } from "../controllers/productController.js";
import { productValidation } from "../validators/productValidation.js";
import { runValidation } from "../validators/runValidation.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.js";

const productRouter = express.Router();

// POST ➡ api/products - create product
productRouter.post("/", upload.single("image"), productValidation, runValidation, isLoggedIn, isAdmin, createProductHandler);

// GET ➡ api/products - get all products
productRouter.get("/", getProductsHandler);

export { productRouter };
