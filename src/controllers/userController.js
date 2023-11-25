import createError from "http-errors";
import User from "../models/userModel.js";
import { successResponseHandler } from "../utils/responseHandler.js";
import { findWithId } from "../services/findWithId.js";
import { createJWT } from "../utils/createJWT.js";
import { clientUrl, jwtSecretKeyForProcessRegister, jwtSecretKeyForResetPassword } from "../config/secret.js";
import { sendEmailWithNodemailer } from "../utils/nodeMailer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { checkUserExists } from "../utils/checkUserExists.js";
import { sendEmail } from "../utils/sendEmail.js";

// process register
async function processRegisterHandler(req, res, next) {
  try {
    // 01 received data from body
    const { name, email, password, phone, address } = req.body;

    // received image file from request
    const image = req.file;

    if (!image) throw createError(400, "Image file is required!");
    if (image.size > 1024 * 1024 * 2) throw new Error("Image file is too large.It must be less than 2 MB!");
    // Note: new Error() / Error() / createError() are about same
    // only in createError() we must use status code as first parameter

    const imageBufferString = image.buffer.toString("base64");

    // 02 check user already exists or not
    const userExists = await checkUserExists(email);
    if (userExists) throw createError(409, "User already exists with this email. Please login!!"); // 409 status code means conflict

    // 03 create token based on body data from user
    const token = createJWT({ name, email, password, phone, address, imageBufferString }, jwtSecretKeyForProcessRegister, "1h");

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

    // try {
    //   await sendEmailWithNodemailer(emailData);
    // } catch (emailError) {
    //   return next(createError(500, "Failed to send verification email!!"));
    // }
    // OR make sendEmail helper function and use it
    sendEmail(emailData);

    // send token to the client also by response
    return successResponseHandler(res, {
      statusCode: 201,
      message: `Please go to your ${email} to complete registration process!`,
    });
  } catch (error) {
    next(error);
  }
}

// activate user account
async function activateUserAccountHandler(req, res, next) {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found!!");

    try {
      const decoded = jwt.verify(token, jwtSecretKeyForProcessRegister);
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

// get all users
async function getUsersHandler(req, res, next) {
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

    if (!users || users.length === 0) throw createError(404, "User not found!!");

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
async function getUserByIdHandler(req, res, next) {
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

// update user by id
async function updateUserByIdHandler(req, res, next) {
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

    const allowedFields = ["name", "password", "phone", "address"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createError(400, "Email can not be updated!");
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) throw new Error("Image file is too large.It must be less than 2 MB!");
      updates.image = image.buffer.toString("base64");
    }

    const updateUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

    if (!updateUser) throw createError(404, "User does not exists with this ID!");

    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: "user updated successfully!",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
}

// delete user by id
async function deleteUserByIdHandler(req, res, next) {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    // call find with id services
    await findWithId(User, id, options);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponseHandler(res, {
      statusCode: 200,
      message: "user deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
}

// banned user by id
async function bannedUserByIdHandler(req, res, next) {
  try {
    const userId = req.params.id;
    // call find with id services
    await findWithId(User, userId);
    const updates = { isBanned: true };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updateUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

    if (!updateUser) throw createError(404, "Ops! User is not banned!");

    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: "user banned successfully!",
    });
  } catch (error) {
    next(error);
  }
}

// unbanned user by id
async function unbannedUserByIdHandler(req, res, next) {
  try {
    const userId = req.params.id;
    // call find with id services
    await findWithId(User, userId);
    const updates = { isBanned: false };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updateUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

    if (!updateUser) throw createError(404, "Ops! User is not unbanned!");

    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: "user unbanned successfully!",
    });
  } catch (error) {
    next(error);
  }
}

// unbanned user by id
async function updatePasswordHandler(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithId(User, userId);

    // compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) throw createError(400, "Old password incorrect!");

    // const filter = { userId };
    // const updates = { $set: { password: newPassword } };
    // const updateOptions = { new: true };
    // OR

    const updatedUser = await User.findByIdAndUpdate(userId, { password: newPassword }, { new: true }).select("-password");

    if (!updatedUser) throw createError(400, "Something wrong! Password is not updated !");

    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: "Password updated successfully!",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
}

// unbanned user by id
async function forgetPasswordHandler(req, res, next) {
  try {
    const { email } = req.body;
    // check user in the database
    const userData = await User.findOne({ email: email });
    if (!userData) throw createError(404, "Email is incorrect or you are not verified your email address. Please register first!");

    // create token for the user
    const token = createJWT({ email }, jwtSecretKeyForResetPassword, "10m");

    const emailData = {
      email,
      subject: "Reset password email",
      html: `
        <h2> Hello ${userData.name} ! </h2>
        <p> Please click here to <a href="${clientUrl}/api/users/reset-password/${token}" target="_blank"> Reset your password </a> </p>
      `,
    };

    // send password reset email
    sendEmail(emailData);

    // OR
    // try {
    //   await sendEmailWithNodemailer(emailData);
    // } catch (emailError) {
    //   return next(createError(500, "Failed to send reset password email!!"));
    // }

    return successResponseHandler(res, {
      statusCode: 201,
      message: `Please go to your ${email} to reset your password!`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
}

// unbanned user by id
async function resetPasswordHandler(req, res, next) {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, jwtSecretKeyForResetPassword);
    // console.log(decoded);

    if (!decoded) throw createError(400, "Invalid or expired token!");

    const filter = { email: decoded.email };
    const updates = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(filter, updates, options).select("-password");

    if (!updatedUser) throw createError(400, "Password reset failed !");

    return successResponseHandler(res, {
      statusCode: 201,
      message: `Password reset successfully!`,
    });
  } catch (error) {
    next(error);
  }
}

export {
  getUsersHandler,
  getUserByIdHandler,
  deleteUserByIdHandler,
  processRegisterHandler,
  activateUserAccountHandler,
  updateUserByIdHandler,
  bannedUserByIdHandler,
  unbannedUserByIdHandler,
  updatePasswordHandler,
  forgetPasswordHandler,
  resetPasswordHandler,
};

// TODO: For creating user we need to call 02 api from client site one is
// POST➡api/users/process-token and second is
// POST➡api/users/create
