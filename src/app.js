import express from 'express';
import morgan from 'morgan';
import createError from 'http-errors';
import { xss } from 'express-xss-sanitizer';
import { rateLimit } from 'express-rate-limit';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { userRouter } from './routers/userRouter.js';
import { errorResponseHandler } from './utils/responseHandler.js';
import { authRouter } from './routers/authRouter.js';
import { categoryRouter } from './routers/categoryRouter.js';
import { seedRouter } from './routers/seedRouter.js';
import { productRouter } from './routers/productRouter.js';

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 5,
  message: 'Too many requests, please try again later.',
});

// middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(xss());
app.use(rateLimiter);

// routes
app.use('/api/seed', seedRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);

// client error route
app.use((req, res, next) => {
  next(createError(404, 'Route not found!'));
});

// server error route
app.use((err, req, res, next) => {
  return errorResponseHandler(res, {
    statusCode: err.status,
    message: err.message,
  });
});

export { app };
