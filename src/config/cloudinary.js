import { v2 as cloudinary } from "cloudinary";
import { cloudinaryApiKey, cloudinaryApiSecret, cloudinaryCloudName } from "./secret.js";

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export { cloudinary };
