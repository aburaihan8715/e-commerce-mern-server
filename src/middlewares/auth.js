import createError from "http-errors";
import jwt from "jsonwebtoken";
import { jwtSecretKeyForAccessToken } from "../config/secret.js";

// check login or not
async function isLoggedIn(req, res, next) {
  try {
    // check token in the cookie
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw createError(401, "Access token not found. Please login!");
    // verify the token
    const decoded = jwt.verify(accessToken, jwtSecretKeyForAccessToken);
    if (!decoded) throw createError(401, "Invalid access token. Please login again!");
    // set user data in the req
    req.user = decoded.user;
    // then go to next middleware
    next();
  } catch (error) {
    next(error);
  }
}
// check login out or not
async function isLoggedOut(req, res, next) {
  try {
    // check token in the cookie
    const accessToken = req.cookies.accessToken;
    if (accessToken) throw createError(400, "User is already logged in!");
    // then go to next middleware
    next();
  } catch (error) {
    next(error);
  }
}
// check admin or not
async function isAdmin(req, res, next) {
  try {
    if (!req.user.isAdmin) throw createError(403, "Forbidden! You must be an admin to access this resources!");
    next();
  } catch (error) {
    next(error);
  }
}

export { isLoggedIn, isLoggedOut, isAdmin };
