import "dotenv/config";

const serverPort = process.env.SERVER_PORT || 5001;
const mongodbAtlasUri = process.env.MONGODB_ATLAS_URI;
const mongodbLocalUri = process.env.MONGODB_LOCAL_URI;
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH;

const jwtSecretKeyForProcessRegister = process.env.JWT_SECRET_KEY_FOR_PROCESS_REGISTER;

const jwtSecretKeyForAccessToken = process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN;
const jwtSecretKeyForRefreshToken = process.env.JWT_SECRET_KEY_FOR_REFRESH_TOKEN;
const jwtSecretKeyForResetPassword = process.env.JWT_SECRET_KEY_FOR_RESET_PASSWORD;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const clientUrl = process.env.CLIENT_URL;

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

export {
  serverPort,
  defaultImagePath,
  jwtSecretKeyForProcessRegister,
  smtpUser,
  smtpPass,
  clientUrl,
  jwtSecretKeyForAccessToken,
  jwtSecretKeyForRefreshToken,
  jwtSecretKeyForResetPassword,
  mongodbAtlasUri,
  mongodbLocalUri,
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
};
