import mongoose from "mongoose";
import { mongodbURL } from "./secret.js";
import { logger } from "../controllers/loggerController.js";

const connectDb = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    logger.log("info", "Db is connected!");
    mongoose.connection.on("error", (error) => {
      logger.log("error", "Db connection error", error);
    });
  } catch (error) {
    logger.log("error", "Db connection failed", error);
    process.exit(1);
  }
};

export { connectDb };
