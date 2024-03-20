import express from 'express';

import { runValidation } from '../validators/runValidation.js';
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/categoryController.js';
import { categoryValidation } from '../validators/categoryValidation.js';
import { isAdmin, isLoggedIn } from '../middlewares/auth.js';

const categoryRouter = express.Router();

// POST ➡ api/categories
categoryRouter.post(
  '/',
  categoryValidation,
  runValidation,
  isLoggedIn,
  isAdmin,
  createCategoryHandler
);

// GET ➡ api/categories
categoryRouter.get('/', getCategoriesHandler);

// GET ➡ api/categories/:slug
categoryRouter.get('/:slug', getCategoryHandler);

// PUT ➡ api/categories/:slug
categoryRouter.put(
  '/:slug',
  categoryValidation,
  runValidation,
  isLoggedIn,
  isAdmin,
  updateCategoryHandler
);

// DELETE ➡ api/categories/:slug
categoryRouter.delete('/:slug', isLoggedIn, isAdmin, deleteCategoryHandler);

export { categoryRouter };
