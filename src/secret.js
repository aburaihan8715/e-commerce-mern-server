import "dotenv/config";
const serverPort = process.env.SERVER_PORT || 5001;
const mongodbURL = process.env.ATLAS_URI || "mongodb://localhost:27017/eCommerceMernDb";
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default-user.png";

export { serverPort, mongodbURL, defaultImagePath };
