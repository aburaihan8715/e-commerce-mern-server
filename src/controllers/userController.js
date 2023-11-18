import createError from "http-errors";
import User from "../models/userModel.js";
import { successResponseHandler } from "../utils/responseHandler.js";
import mongoose from "mongoose";

// get all users
async function getUsers(req, res, next) {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5; // limit means doc for per page

    const searchRegexp = new RegExp(`.*${search}.*`, "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [{ name: { $regex: searchRegexp } }, { email: { $regex: searchRegexp } }, { phone: { $regex: searchRegexp } }],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "User not found!!");

    return successResponseHandler(res, {
      statusCode: 200,
      message: "Users returned successfully!",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// get single user
async function getUser(req, res, next) {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await User.findById(id, options);

    if (!user) throw createError(404, "User does not exist with this id!");

    return successResponseHandler(res, {
      statusCode: 200,
      message: "User returned successfully!",
      payload: { user },
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return next(createError(404, "Invalid user Id"));
    }
    next(error);
  }
}

export { getUsers, getUser };
