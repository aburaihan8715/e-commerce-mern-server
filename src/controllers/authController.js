import createError from "http-errors";
import User from "../models/userModel.js";
import { successResponseHandler } from "../utils/responseHandler.js";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/createJWT.js";
import { jwtSecretKeyForAccessToken, jwtSecretKeyForRefreshToken } from "../config/secret.js";
import jwt from "jsonwebtoken";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../utils/cookie.js";

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

    // create access token
    const accessToken = createJWT({ user }, jwtSecretKeyForAccessToken, "5m");
    // set access token in the cookie
    setAccessTokenCookie(res, accessToken);

    // create refresh token
    const refreshToken = createJWT({ user }, jwtSecretKeyForRefreshToken, "7d");
    // set refresh token in the cookie
    setRefreshTokenCookie(res, refreshToken);

    // user with out password
    const userWithoutPassword = user.toObject(); //another instance of user
    delete userWithoutPassword.password;
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
    // remove access token and refresh token from the cookie
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
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

// refresh token handler
async function refreshTokenHandler(req, res, next) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    // verify old refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jwtSecretKeyForRefreshToken);

    if (!decodedToken) throw createError(401, "Invalid refresh token. Please login again!");

    // create access token
    const accessToken = createJWT(decodedToken.user, jwtSecretKeyForAccessToken, "5m");
    // set access token in the cookie
    setAccessTokenCookie(res, accessToken);

    return successResponseHandler(res, {
      statusCode: 201,
      message: "New access token is generated!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
}

// protected handler
async function protectedRouteHandler(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    // verify access token
    const decodedToken = jwt.verify(accessToken, jwtSecretKeyForAccessToken);

    if (!decodedToken) throw createError(401, "Invalid access token. Please login again!");

    return successResponseHandler(res, {
      statusCode: 201,
      message: "Protected resources accessed successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
}

export { loginHandler, logoutHandler, refreshTokenHandler, protectedRouteHandler };
