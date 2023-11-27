import createError from "http-errors";
import { successResponseHandler } from "../utils/responseHandler.js";
import { createProduct, deleteProductBySlug, getProductBySlug, getProducts, updateProductBySlug } from "../services/productService.js";

// create product controller/handler
async function createProductHandler(req, res, next) {
  try {
    // received data from body
    const { name, description, price, quantity, shipping, category } = req.body;
    // received image file from request file
    const image = req.file;

    if (!image) throw createError(400, "Image file is required!");
    if (image.size > 1024 * 1024 * 2) throw new Error("Image file is too large.It must be less than 2 MB!");
    // Note: new Error() / Error() / createError() are about same
    // only in createError() we must use status code as first parameter
    const imageBufferString = image.buffer.toString("base64");

    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      category,
      imageBufferString,
    };

    const product = await createProduct(productData);

    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: `Product created successfully!`,
      payload: product,
    });
  } catch (error) {
    next(error);
  }
}

// get products controller/handler
async function getProductsHandler(req, res, next) {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const searchRegexp = new RegExp(`.*${search}.*`, "i");

    const filter = {
      $or: [
        { name: { $regex: searchRegexp } },
        // { email: { $regex: searchRegexp } },
      ],
    };

    const productsData = await getProducts(page, limit, filter);

    // success response
    return successResponseHandler(res, {
      statusCode: 200,
      message: `Products returned successfully!`,
      payload: {
        products: productsData.products,
        // FIXME: see auth controller for details pagination
        pagination: {
          totalPages: productsData.totalPages,
          currentPage: productsData.currentPage,
          previousPage: productsData.currentPage - 1,
          nextPage: productsData.currentPage + 1,
          totalNumberOfProducts: productsData.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// get product by slug  controller/handler
async function getProductBySlugHandler(req, res, next) {
  try {
    const { slug } = req.params;
    const product = await getProductBySlug(slug);
    // success response
    return successResponseHandler(res, {
      statusCode: 200,
      message: `Product returned successfully!`,
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
}

// get product by slug  controller/handler
async function deleteProductBySlugHandler(req, res, next) {
  try {
    const { slug } = req.params;
    await deleteProductBySlug(slug);
    // success response
    return successResponseHandler(res, {
      statusCode: 200,
      message: `Product deleted successfully!`,
    });
  } catch (error) {
    next(error);
  }
}

// update product by slug
async function updateProductBySlugHandler(req, res, next) {
  try {
    const { slug } = req.params;
    let updates = {};
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const allowedFields = ["name", "description", "price", "sold", "quantity", "shipping"];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
      // else if (key === "email") {
      //   throw createError(400, "Email can not be updated!");
      // }
    }

    const image = req.file;

    const updatedProduct = await updateProductBySlug(slug, updates, image, updateOptions);
    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: "Product updated successfully!",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export { createProductHandler, getProductsHandler, getProductBySlugHandler, deleteProductBySlugHandler, updateProductBySlugHandler };
