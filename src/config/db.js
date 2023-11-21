import mongoose from "mongoose";
import { mongodbURL } from "../secret.js";

const connectDb = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("Db is connected!");
    mongoose.connection.on("error", (err) => {
      console.error(err);
    });
  } catch (error) {
    console.log(error.message);
    console.log("Connection failed!!");
    process.exit(1);
  }
};

export { connectDb };
