import {
  Types,
  Schema,
  models,
  model,
  HydratedDocument,
  InferSchemaType
} from "mongoose";

const subcategorySchema = new Schema(
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
      type: Schema.Types.ObjectId,
      ref: "Category", // ref helps to populate look at to determine the foreign collection it should query
      required: true
    }
  },
  { timestamps: true }
);

export type ISubcategory = InferSchemaType<typeof subcategorySchema> & {
  _id: Types.ObjectId;
};
export type SubcategoryDoc = HydratedDocument<ISubcategory>;

const Subcategory =
  models.Subcategory || model<ISubcategory>("Subcategory", subcategorySchema);

export default Subcategory;
