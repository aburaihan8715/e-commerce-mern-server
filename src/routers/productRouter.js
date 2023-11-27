import express from "express";

import { upload } from "../middlewares/uploadFile.js";
import {
  createProductHandler,
  getProductsHandler,
  getProductBySlugHandler,
  deleteProductBySlugHandler,
  updateProductBySlugHandler,
} from "../controllers/productController.js";
import { productValidation } from "../validators/productValidation.js";
import { runValidation } from "../validators/runValidation.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.js";

const productRouter = express.Router();

// POST ➡ api/products - create product
productRouter.post("/", upload.single("image"), productValidation, runValidation, isLoggedIn, isAdmin, createProductHandler);

// GET ➡ api/products - get all products
productRouter.get("/", getProductsHandler);

// TODO: Note: function should be generic like getProduct(),deleteProduct() ➡ then we will be able to use slug/id/name

// GET ➡ api/products/:slug - get single product
productRouter.get("/:slug", getProductBySlugHandler);

// DELETE ➡ api/products/:slug - delete a product
productRouter.delete("/:slug", isLoggedIn, isAdmin, deleteProductBySlugHandler);

// PUT ➡ api/products/:slug - update a product
productRouter.put("/:slug", upload.single("image"), isLoggedIn, isAdmin, updateProductBySlugHandler);

export { productRouter };
