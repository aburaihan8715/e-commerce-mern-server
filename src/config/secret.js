import "dotenv/config";
const serverPort = process.env.SERVER_PORT || 5001;

const mongodbURL = process.env.ATLAS_URI || "mongodb://localhost:27017/eCommerceMernDb";

const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default-user.png";

const jwtSecretKeyForProcessRegister = process.env.JWT_SECRET_KEY_FOR_PROCESS_REGISTER || "fowiwerorfuiqwriiw4549fkwrkgo;erwkfwr@#5";

const jwtSecretKeyForAccessToken = process.env.JWT_SECRET_KEY_FOR_ACCESS_TOKEN || "fowiwerorfuiqwriiw4549fkwrkgo;erwkfwr@#5";

const jwtSecretKeyForRefreshToken = process.env.JWT_SECRET_KEY_FOR_REFRESH_TOKEN || "fowiwerorfuiqwriiw4549fkwrkgo;erwkfwr@#5";

const jwtSecretKeyForResetPassword = process.env.JWT_SECRET_KEY_FOR_RESET_PASSWORD || "fowfowaoiwrds54d4wd54fdfs54d545r4f5rw4fg";

const smtpUser = process.env.SMTP_USER || "";

const smtpPass = process.env.SMTP_PASS || "";

const clientUrl = process.env.CLIENT_URL || "";

export {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtSecretKeyForProcessRegister,
  smtpUser,
  smtpPass,
  clientUrl,
  jwtSecretKeyForAccessToken,
  jwtSecretKeyForRefreshToken,
  jwtSecretKeyForResetPassword,
};
