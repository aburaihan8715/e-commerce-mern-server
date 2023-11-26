import slugify from "slugify";
import Category from "../models/categoryModel.js";

// create category service
async function createCategory(name) {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });
  return newCategory;
}

// get categories service
async function getCategories() {
  // Note: lean() for returning javascript object not mongoose object
  return await Category.find({}).select("name slug").lean();
}

// get category service
async function getCategory(slug) {
  // Note: lean() for returning javascript object not mongoose object
  return await Category.find({ slug }).select("name slug").lean();
}

// update category service
async function updateCategory(name, slug) {
  const filter = { slug };
  const updates = { $set: { name: name, slug: slugify(name) } };
  const options = { new: true };
  const updateCategory = await Category.findOneAndUpdate(filter, updates, options);
  return updateCategory;
}

// delete category service
async function deleteCategory(slug) {
  const result = await Category.findOneAndDelete({ slug });
  if (!result) throw createError(404, "No category found for delete!");
  return result;
}

export { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
