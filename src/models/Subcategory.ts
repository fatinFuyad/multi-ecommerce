import { PrettifyType } from "@/lib/types";
import {
  Types,
  Schema,
  models,
  model,
  HydratedDocument,
  InferSchemaType,
  MergeType
} from "mongoose";

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: [2, "Subcategory name should be at least 2 characters"],
      maxLength: [50, "Subcategory name should not exceed 50 characters"],
      required: [true, "Subcategory name is required"]
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // ref helps to populate look at to determine the foreign collection it should query
      required: true
    }
  },
  { timestamps: true }
);

// INDEXING FOR SUBCATEGORY
subcategorySchema.index({ name: "asc" }, { unique: true });
subcategorySchema.index({ url: "asc" }, { unique: true });

export type ISubcategory = InferSchemaType<typeof subcategorySchema> & {
  _id: Types.ObjectId;
};

export type SubcategoryDoc = HydratedDocument<ISubcategory>;

// prettier-ignore
export type SubcategorySchema = PrettifyType<
  MergeType<ISubcategory, Partial<
      Pick<ISubcategory, "featured"|"createdAt"|"updatedAt"|"_id">
  >>>;

const Subcategory =
  models.Subcategory<ISubcategory> ||
  model<ISubcategory>("Subcategory", subcategorySchema);

export default Subcategory;
