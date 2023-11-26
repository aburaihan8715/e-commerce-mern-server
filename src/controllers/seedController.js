import { data } from "../data/data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// seed users
async function seedUsers(req, res, next) {
  try {
    await User.deleteMany({});
    const users = await User.insertMany(data.users);
    res.status(200).send({
      message: "Users returned!",
      users,
    });
  } catch (error) {
    next(error);
  }
}

// seed products
async function seedProducts(req, res, next) {
  try {
    // 01. Delete all products from the collection
    await Product.deleteMany({});
    // 02. Insert products in the collection
    const products = await Product.insertMany(data.products);
    // 03. success response
    res.status(200).send({
      message: "Products returned!",
      products,
    });
  } catch (error) {
    next(error);
  }
}

export { seedUsers, seedProducts };
