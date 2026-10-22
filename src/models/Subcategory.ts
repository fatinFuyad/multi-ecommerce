import { InferSchemaWithId, InterfaceFromSchema, PartialSchema } from "@/lib/types";
import { HydratedDocument, Schema, model, models } from "mongoose";

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

// DEFAULT SCHEMA TYPE
export type SubcategorySchema = InferSchemaWithId<typeof subcategorySchema>;

// USE FOR THE RETURNED DATA FROM API RESPONSE
export type ISubcategory = InterfaceFromSchema<SubcategorySchema>;

// THE MONGOOSE HYDRATED DOCUMENT
export type SubcategoryDoc = HydratedDocument<SubcategorySchema>;

// USE FOR CREATING NEW DOCUMENT
export type SubcategoryRawSchema = PartialSchema<
  SubcategorySchema,
  "featured" | "createdAt" | "updatedAt" | "_id"
>;

const Subcategory = models.Subcategory || model("Subcategory", subcategorySchema);

export default Subcategory;
