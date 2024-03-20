import express from 'express';
import { seedUsers, seedProducts } from '../controllers/seedController.js';
import { upload } from '../middlewares/uploadFile.js';

const seedRouter = express.Router();

seedRouter.get('/users', seedUsers);
seedRouter.get('/products', seedProducts);

export { seedRouter };
