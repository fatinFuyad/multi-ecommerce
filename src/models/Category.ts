import {
  HydratedDocument,
  InferSchemaType,
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
      required: [true, "Category name is required"],
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
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory"
      }
    ]
  },
  { timestamps: true }
);

export type ICategory = InferSchemaType<typeof categorySchema> & {
  readonly _id: Types.ObjectId;
};
export type CategoryDoc = HydratedDocument<ICategory>;

// on inital time the models will be and empty {}; and so reading any property will be undefined

const Category = models.Category || model<ICategory>("Category", categorySchema);

export default Category;
