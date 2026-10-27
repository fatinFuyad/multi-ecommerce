import { InferSchemaWithId, InterfaceFromSchema, PartialSchema } from "@/lib/types";
import { HydratedDocument, Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: [2, "Category name should be at least 2 characters"],
      maxLength: [50, "Category name should not exceed 50 characters"],
      required: [true, "Category name is required"]
    },
    image: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory"
      }
    ]
  },
  { timestamps: true }
);

// INDEXING FOR CATEGORY
categorySchema.index({ name: "asc" }, { unique: true });
categorySchema.index({ url: "asc" }, { unique: true });

// DEFAULT SCHEMA TYPE
export type CategorySchema = InferSchemaWithId<typeof categorySchema>;

// USE FOR THE RETURNED DATA FROM API RESPONSE
export type ICategory = InterfaceFromSchema<CategorySchema>;

// THE MONGOOSE HYDRATED DOCUMENT
export type CategoryDoc = HydratedDocument<CategorySchema>;

// USE FOR CREATING NEW DOCUMENT
export type CategoryRawSchema = PartialSchema<
  CategorySchema,
  "featured" | "createdAt" | "updatedAt" | "_id"
>;

// if model is already registered, prevent re-creating new model
const Category = models.Category || model("Category", categorySchema);

export default Category;
