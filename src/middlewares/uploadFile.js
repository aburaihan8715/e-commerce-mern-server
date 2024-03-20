import multer from "multer";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../config/variables.js";

/*=============start===========
// image as string
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
=============end===========*/

// image as buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("File size exceeds the maximum limits!"), false);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File tye is not allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export { upload };
