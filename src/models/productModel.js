import mongoose from "mongoose";
const { Schema } = mongoose;

// name,slug,description,price,quantity,sold,shipping,image, category
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minLength: [3, "Product name should be minimum 3 characters!"],
      maxLength: [150, "Product name should be maximum 150 characters!"],
    },

    slug: {
      type: String,
      required: [true, "Product name is required"],
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minLength: [3, "Product description should be minimum 3 characters!"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => `${props.value} is not a valid price. Price must be greater than 0`,
      },
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => `${props.value} is not a valid quantity. Quantity must be greater than 0`,
      },
    },

    sold: {
      type: Number,
      required: [true, "sold quantity is required"],
      trim: true,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0, // it may be free or paid. default 0 means free
    },

    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Product image is required!"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },

  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
