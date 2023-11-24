import createError from "http-errors";
import User from "../models/userModel.js";
import { successResponseHandler } from "../utils/responseHandler.js";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/createJWT.js";
import { jwtSecretKeyForAccessToken } from "../secret.js";

// login handler
async function loginHandler(req, res, next) {
  try {
    // email, password from req.body
    const { email, password } = req.body;

    // isExists
    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User does not exists with this email.Please register first!");

    // compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw createError(401, "Email/password did not match!");

    // isBanned
    if (user.isBanned) throw createError(403, "You are banned. Please contact authority!");

    // create token
    const accessToken = createJWT({ user }, jwtSecretKeyForAccessToken, "15m");

    // set token in the cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      // secure: true,  // if https then secure true
      sameSite: "none",
    });

    // user with out password
    const userWithoutPassword = await User.findOne({ email }).select("-password");
    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: "user logged in successfully!",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
}

// logout handler
async function logoutHandler(req, res, next) {
  try {
    // remove token from the cookie
    res.clearCookie("accessToken");
    // success response
    return successResponseHandler(res, {
      statusCode: 201,
      message: "user logged out successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
}
export { loginHandler, logoutHandler };
