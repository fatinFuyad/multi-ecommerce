import { PrettifyType } from "@/lib/types";
import {
  HydratedDocument,
  InferSchemaType,
  MergeType,
  Schema,
  Types,
  model,
  models
} from "mongoose";

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

export type ICategory = InferSchemaType<typeof categorySchema> & {
  readonly _id: Types.ObjectId;
};
export type CategoryDoc = HydratedDocument<ICategory>;

// prettier-ignore
export type CategorySchema = PrettifyType< MergeType<
    ICategory, Partial<
      Pick<ICategory, "featured"|"createdAt"|"updatedAt"|"_id">
  >>>;

// if model is already registered, prevent re-creating new model
const Category = models.Category || model<ICategory>("Category", categorySchema);

export default Category;
