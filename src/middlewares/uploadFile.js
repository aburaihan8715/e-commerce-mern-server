import multer from "multer";
import path from "path";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_USER_IMG_DIR } from "../config/variables.js";

// const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/images/users";
// const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 2097152; //1024 * 1024 * 2=2097152;
// const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES || ["jpg", "jpeg", "png"];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_USER_IMG_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
    return cb(new Error("File type not allowed!!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });

export { upload };
