import mongoose, { Document } from "mongoose";

export interface ISubcategory {
  name: string;
  image: string;
  url: string;
  featured?: boolean;
  category: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubcategoryDoc
  extends Document<mongoose.Types.ObjectId>, ISubcategory {}

const subCategorySchema = new mongoose.Schema<SubcategoryDoc>(
  {
    name: {
      type: String,
      minLength: [2, "Subcategory name should be at least 2 characters"],
      maxLength: [50, "Subcategory name should not exceed 50 characters"],
      required: [true, "Subcategory name is required"],
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      unique: true
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

const Subcategory =
  mongoose.models.Subcategory<SubcategoryDoc> ||
  mongoose.model("Subcategory", subCategorySchema);

export default Subcategory;
