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
async function getProducts(page = 1, limit = 4, filter = {}) {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  // FIXME: Note: "category" means category id here, so I think "categoryId" is better option
  if (!products) throw createError(404, "No products found!");

  const count = await Product.find(filter).countDocuments();

  return { products, count, totalPages: Math.ceil(count / limit), currentPage: page };
}

// get product service
async function getProductBySlug(slug) {
  const product = await Product.findOne({ slug }).populate("category");
  if (!product) throw createError(404, "No product found!");
  return product;
}

// delete product service
async function deleteProductBySlug(slug) {
  const result = await Product.findOneAndDelete({ slug });
  if (!result) throw createError(404, "No product found for delete!");
  return result;
}

// update product service
async function updateProductBySlug(slug, updates, image, updateOptions) {
  if (image) {
    if (image.size > 1024 * 1024 * 2) throw new Error("Image file is too large.It must be less than 2 MB!");
    updates.image = image.buffer.toString("base64");
  }

  if (updates.name) updates.slug = slugify(updates.name);

  const updateProduct = await Product.findOneAndUpdate({ slug }, updates, updateOptions);

  if (!updateProduct) throw createError(404, "Product does not exists with this slug!");

  return updateProduct;
}

export { createProduct, getProducts, getProductBySlug, deleteProductBySlug, updateProductBySlug };
