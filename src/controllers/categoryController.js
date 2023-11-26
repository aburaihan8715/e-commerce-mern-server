import createError from "http-errors";
import { successResponseHandler } from "../utils/responseHandler.js";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../services/categoryService.js";

// create category controller/handler
async function createCategoryHandler(req, res, next) {
  try {
    const { name } = req.body;
    // create new category
    await createCategory(name);
    return successResponseHandler(res, {
      statusCode: 201,
      message: `Category created successfully!`,
    });
  } catch (error) {
    next(error);
  }
}

// get categories controller/handler
async function getCategoriesHandler(req, res, next) {
  try {
    const categories = await getCategories();
    return successResponseHandler(res, {
      statusCode: 200,
      message: `Categories got successfully!`,
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
}

// get category controller/handler
async function getCategoryHandler(req, res, next) {
  try {
    const { slug } = req.params;
    // get category
    const category = await getCategory(slug);
    if (!category) throw createError(404, "Category not found with this slug!");

    return successResponseHandler(res, {
      statusCode: 201,
      message: `Category got successfully!`,
      payload: category,
    });
  } catch (error) {
    next(error);
  }
}

// update category controller/handler
async function updateCategoryHandler(req, res, next) {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    // update category
    const updatedCategory = await updateCategory(name, slug);
    if (!updatedCategory) throw createError(404, "Category not found with this slug!");

    return successResponseHandler(res, {
      statusCode: 201,
      message: `Category updated successfully!`,
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
}

// delete category controller/handler
async function deleteCategoryHandler(req, res, next) {
  try {
    const { slug } = req.params;
    await deleteCategory(slug);
    return successResponseHandler(res, {
      statusCode: 201,
      message: `Category deleted successfully!`,
    });
  } catch (error) {
    next(error);
  }
}

export { createCategoryHandler, getCategoriesHandler, getCategoryHandler, updateCategoryHandler, deleteCategoryHandler };
