import mongoose, { Document, ObjectId } from "mongoose";

export interface ISubCategory {
  name: string;
  image: string;
  url: string;
  featured?: boolean;
  category: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubCategoryData
  extends Document<mongoose.Types.ObjectId>, ISubCategory {}
const subCategorySchema = new mongoose.Schema<SubCategoryData>(
  {
    name: {
      type: String,
      minLength: [2, "SubCategory name should be at least 2 characters"],
      maxLength: [50, "SubCategory name should not exceed 50 characters"],
      // required: [true, "SubCategory name is required"]
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // ref helps to populate look at to determine the foreign collection it should query
      requred: true
    }
  },
  { timestamps: true }
);

const SubCategory =
  mongoose.models.SubCategory<SubCategoryData> ||
  mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
