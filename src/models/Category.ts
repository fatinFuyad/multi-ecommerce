import mongoose, { Document } from "mongoose";

export interface ICategory {
  name: string;
  image: string;
  // image: { url: string }[];
  url: string;
  featured?: boolean;
  subCategories?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryData
  extends Document<mongoose.Types.ObjectId>, ICategory {}
const categorySchema = new mongoose.Schema<CategoryData>(
  {
    name: {
      type: String,
      minLength: [2, "Category name should be at least 2 characters"],
      maxLength: [50, "Category name should not exceed 50 characters"],
      // required: [true, "Category name is required"]
      required: true
    },
    image: {
      type: String,
      required: true
    },
    // image: [{ url: String }],
    // TypeError: Invalid schema configuration: Could not determine the embedded type for array `required`
    // image: [{ url: String, required: [true, "Image is required"] }],
    url: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    subCategories: [mongoose.Types.ObjectId]
  },
  { timestamps: true }
);

// console.log(mongoose.models);

// on inital time the models will be and empty {}; and so reading any property will be undefined

const Category =
  mongoose.models.Category<CategoryData> ||
  mongoose.model("Category", categorySchema);

export default Category;
