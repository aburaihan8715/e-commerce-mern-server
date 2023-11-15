import express from "express";
import morgan from "morgan";
const app = express();
import createError from "http-errors";
import { xss } from "express-xss-sanitizer";
import { rateLimit } from "express-rate-limit";
// import { rateLimit } from 'express-rate-limit'
// const { xss } = require('express-xss-sanitizer');
// const createError = require("http-errors");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 5,
  message: "Too many requests, please try again later.",
});

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(xss());
app.use(rateLimiter);

// test route
app.get("/test", (req, res) => {
  res.status(200).send({
    message: "get: Hello from test route!",
  });
});
app.get("/api/users", (req, res) => {
  res.status(200).send({
    message: " Hello from users route!",
  });
});

// client error route
app.use((req, res, next) => {
  next(createError(404, "Route not found!"));
});

// server error route
app.use((err, req, res, next) => {
  return res.status(err.status || 500).send({
    success: false,
    message: err.message,
  });
});

export { app };
