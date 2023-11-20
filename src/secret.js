import "dotenv/config";
const serverPort = process.env.SERVER_PORT || 5001;
const mongodbURL = process.env.ATLAS_URI || "mongodb://localhost:27017/eCommerceMernDb";
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default-user.png";
const jwtSecretKey = process.env.JWT_SECRET_KEY || "fowiwerorfuiqwriiw4549fkwrkgo;erwkfwr@#5";

const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const clientUrl = process.env.CLIENT_URL || "";

export { serverPort, mongodbURL, defaultImagePath, jwtSecretKey, smtpUser, smtpPass, clientUrl };
