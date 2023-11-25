import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name should be minimum 3 characters!"],
      maxLength: [30, "Name should be maximum 30 characters!"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be minimum 6 characters!"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(8)),
    },

    // image as string
    // image: {
    //   type: String,
    //   default: defaultImagePath,
    // },

    // image as buffer
    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Image is required!"],
    },

    address: {
      type: String,
      minLength: [3, "Address should be minimum 3 characters!"],
      required: [true, "Address is required"],
    },

    phone: {
      type: String,
      required: [true, "Phone no is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
