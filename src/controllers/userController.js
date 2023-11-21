import createError from "http-errors";
import User from "../models/userModel.js";
import { successResponseHandler } from "../utils/responseHandler.js";
import { findWithId } from "../services/findWithId.js";
import { deleteImageHandler } from "../utils/deleteImageHandler.js";
import { createJWT } from "../utils/createJWT.js";
import { clientUrl, jwtSecretKey } from "../secret.js";
import { sendEmailWithNodemailer } from "../utils/nodeMailer.js";
import jwt from "jsonwebtoken";

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

// get single user by id
async function getUserById(req, res, next) {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    // call find with id services
    const user = await findWithId(User, id, options);
    return successResponseHandler(res, {
      statusCode: 200,
      message: "user returned successfully!",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
}

// delete user by id
async function deleteUserById(req, res, next) {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    // call find with id services
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;
    // call image delete function
    deleteImageHandler(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponseHandler(res, {
      statusCode: 200,
      message: "user deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
}

// update user by id
async function updateUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    // call find with id services
    await findWithId(User, userId, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };
    // call find with id services
    let updates = {};
    // name,email,password,phone,image,address
    // if (req.body.name) {
    //   updates.name = req.body.name;
    // }
    // if (req.body.password) {
    //   updates.password = req.body.password;
    // }
    // if (req.body.phone) {
    //   updates.phone = req.body.phone;
    // }
    // if (req.body.address) {
    //   updates.address = req.body.address;
    // }
    // OR
    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw new Error("Email can not be updated!");
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) throw new Error("Image file is too large.It must be less than 2 MB!");
      updates.image = image.buffer.toString("base64");
    }

    const updateUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

    if (!updateUser) throw createError(404, "User does not exists with this ID!");

    return successResponseHandler(res, {
      statusCode: 201,
      message: "user updated successfully!",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
}

// process register
// FIXME:  I think it api should be api/users/process-token and function name should be processToken()
async function processRegister(req, res, next) {
  try {
    // 01 received data from body
    const { name, email, password, phone, address } = req.body;

    const image = req.file;

    if (!image) throw createError(400, "Image file is required!");
    if (image.size > 1024 * 1024 * 2) throw new Error("Image file is too large.It must be less than 2 MB!");
    // Note: new Error() / Error() / createError() are about same
    // only in createError() we must use status code as first parameter

    const imageBufferString = image.buffer.toString("base64");

    // 02 check user already exists or not
    const userExists = await User.exists({ email: email });

    if (userExists) throw createError(409, "User already exists with this email. Please login!!"); // 409 status code means conflict

    // 03 create token based on body data from user
    const token = createJWT({ name, email, password, phone, address, imageBufferString }, jwtSecretKey, "1h");

    // 04 prepare email data and send token to the client by link
    const emailData = {
      email,
      subject: "Account activation email",
      html: `
        <h2> Hello ${name} </h2>
        <p> Please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
      `,
    };
    // send email data to the smtp server
    try {
      await sendEmailWithNodemailer(emailData);
    } catch (emailError) {
      return next(createError(500, "Failed to send verification email!!"));
    }

    // send toke to the client also by response
    return successResponseHandler(res, {
      statusCode: 201,
      message: `Please go to your ${email} to complete registration process!`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
}

// create user
// FIXME: I think api should be api/users/create and function name should be createUser()
async function activateUserAccount(req, res, next) {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found!!");

    try {
      const decoded = jwt.verify(token, jwtSecretKey);
      if (!decoded) throw createError(406, "Invalid token!!");

      // 02 check user already exists or not
      const userExists = await User.exists({ email: decoded.email });

      if (userExists) throw createError(409, "User already exists with this email. Please login!!"); // 409 status code means conflict

      // create user based on verified data
      await User.create(decoded);

      return successResponseHandler(res, {
        statusCode: 201,
        message: `User registered successfully!!`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") throw createError(401, "Token has expired!!");
      else if (error.name === "JsonWebTokenError") throw createError(401, "Invalid token");
      else throw error;
    }
  } catch (error) {
    next(error);
  }
}

export { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById };

// TODO: For creating user we need to call 02 api from client site one is
// POST➡api/users/process-token and second is
// POST➡api/users/create
