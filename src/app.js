import express from "express";
import morgan from "morgan";
import createError from "http-errors";
import { xss } from "express-xss-sanitizer";
import { rateLimit } from "express-rate-limit";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 5,
  message: "Too many requests, please try again later.",
});

import { userRouter } from "./routers/userRouter.js";
import { errorResponseHandler } from "./utils/responseHandler.js";
import { authRouter } from "./routers/authRouter.js";
import { categoryRouter } from "./routers/categoryRouter.js";
import { seedRouter } from "./routers/seedRouter.js";
import { productRouter } from "./routers/productRouter.js";

// middleware
app.use(morgan("dev"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(xss());
app.use(rateLimiter);

// seed routes
app.use("/api/seed", seedRouter);
// user routes
app.use("/api/users", userRouter);
// auth routes
app.use("/api/auth", authRouter);
// category routes
app.use("/api/categories", categoryRouter);
// product routes
app.use("/api/products", productRouter);

// test route
app.get("/test", (req, res) => {
  res.status(200).send({
    message: "get: Hello from test route!",
  });
});

// client error route
app.use((req, res, next) => {
  next(createError(404, "Route not found!"));
});

// server error route
app.use((err, req, res, next) => {
  return errorResponseHandler(res, {
    statusCode: err.status,
    message: err.message,
  });
});

export { app };
