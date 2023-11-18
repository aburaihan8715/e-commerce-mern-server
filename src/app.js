import express from "express";
const app = express();
import morgan from "morgan";
import createError from "http-errors";
import { xss } from "express-xss-sanitizer";
import { rateLimit } from "express-rate-limit";
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 5,
  message: "Too many requests, please try again later.",
});
import { seedUserRouter } from "./routers/seedUserRouter.js";
import { userRouter } from "./routers/userRouter.js";
import { errorResponseHandler } from "./utils/responseHandler.js";

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(xss());
app.use(rateLimiter);

// user routes
app.use("/api/users", userRouter);
app.use("/api/seed", seedUserRouter);

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
