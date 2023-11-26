import Product from "../models/productModel.js";
import createError from "http-errors";
import slugify from "slugify";

// create product service
async function createProduct(productData) {
  const { name, description, price, quantity, shipping, category, imageBufferString } = productData;

  // check product already exists or not
  const productExists = await Product.exists({ name: name });
  if (productExists) throw createError(409, "Product already exists with this name !"); // 409 status code means conflict

  // create product
  const product = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: imageBufferString,
    category: category,
  });

  return product;
}

// get products service
async function getProducts(page = 1, limit = 4) {
  const products = await Product.find({})
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  // FIXME: Note: "category" means category id here, so I think "categoryId" is better option
  if (!products) throw createError(404, "No products found!");

  const count = await Product.find({}).countDocuments();

  return { products, count, totalPages: Math.ceil(count / limit), currentPage: page };
}
export { createProduct, getProducts };
