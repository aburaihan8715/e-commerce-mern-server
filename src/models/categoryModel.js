import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      unique: true,
      minLength: [3, "Category should be minimum 3 characters!"],
    },
    slug: {
      type: String,
      required: [true, "Category is required"],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
