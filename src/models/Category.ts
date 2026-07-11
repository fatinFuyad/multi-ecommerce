import mongoose, { Document } from "mongoose";

export interface ICategory {
  _id?: mongoose.Types.ObjectId;
  name: string;
  image: string;
  url: string;
  featured?: boolean;
  subCategories?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryDoc
  extends Document<mongoose.Types.ObjectId>, Omit<ICategory, "_id"> {}
const categorySchema = new mongoose.Schema<CategoryDoc>(
  {
    name: {
      type: String,
      minLength: [2, "Category name should be at least 2 characters"],
      maxLength: [50, "Category name should not exceed 50 characters"],
      required: [true, "Category name is required"],
      unique: true
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
      required: true,
      unique: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    subCategories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Subcategory"
      }
    ]
  },
  { timestamps: true }
);

// console.log(mongoose.models);

// on inital time the models will be and empty {}; and so reading any property will be undefined

const Category =
  mongoose.models.Category<CategoryDoc> ||
  mongoose.model("Category", categorySchema);

export default Category;
