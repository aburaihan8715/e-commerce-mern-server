import { validationResult } from "express-validator";
import { errorResponseHandler } from "../utils/responseHandler.js";

const runValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponseHandler(res, { statusCode: 422, message: errors.array()[0].msg });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export { runValidation };
