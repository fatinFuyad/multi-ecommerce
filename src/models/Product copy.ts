import {
  Add_id,
  AddObjectId,
  InferSchemaWithId,
  InterfaceFromSchema,
  PartialSchema
} from "@/lib/types";
import { HydratedDocument, InferSchemaType, model, models, Schema } from "mongoose";

// SUBDOCUMENT SCHEMA DEFINITIONS
const variantSizeSchema = new Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true }
});

const variantImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String, default: "Product_Img" },
  order: { type: Number }
});

const variantColorSchema = new Schema({
  color: {
    type: String,
    required: true
  }
});

const specificationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: { type: String, required: true }
});

const questionSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

// SUBDOCUMENT TYPES
export type IVariantSize = InterfaceFromSchema<
  AddObjectId<InferSchemaType<typeof variantSizeSchema>>
>;
export type IVariantImage = Add_id<InferSchemaType<typeof variantImageSchema>>;
export type IVariantColor = Add_id<InferSchemaType<typeof variantColorSchema>>;
export type ISpecification = Add_id<InferSchemaType<typeof specificationSchema>>;
export type IQuestion = Add_id<InferSchemaType<typeof questionSchema>>;

// PRODUCT SCHEMA DEFINITION
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    brand: { type: String, required: true },
    // rating: { type: Number, default: 0, max: 5, min: 0 },
    ratingSum: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      max: 5,
      min: 0
    },
    sales: { type: Number, default: 0 },
    shippingFeeMethod: {
      type: String,
      enum: {
        values: ["ITEM", "WEIGHT", "FIXED"],
        message: "{VALUE} is not acceptable as shipping fee method"
      },
      default: "ITEM"
    },
    freeShipping: [{ type: Schema.ObjectId, ref: "FreeShipping" }],
    freeShippingForAllCountries: { type: Boolean, default: false },
    store: { type: Schema.ObjectId, ref: "Store", required: true },
    offerTag: { type: Schema.ObjectId, ref: "OfferTag" },
    category: { type: Schema.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.ObjectId, ref: "Subcategory", required: true },
    variants: [{ type: Schema.ObjectId, ref: "ProductVariant", required: true }],
    specifications: [specificationSchema],
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

// INDEXING FOR PRODUCT
productSchema.index({ slug: "asc" }, { unique: true });
productSchema.index({ store: "asc" });

// DEFAULT SCHEMA TYPE
export type ProductSchema = InferSchemaWithId<typeof productSchema>;

// MONGOOSE HYDRATED DOCUMENT
export type ProductDoc = HydratedDocument<ProductSchema>;

// USE FOR THE RETURNED DATA FROM API RESPONSE
export type IProduct = InterfaceFromSchema<ProductSchema>;

// USE FOR CREATING NEW DOCUMENTS
// prettier-ignore
export type ProductRawSchema = PartialSchema<
  ProductSchema, "_id"|"createdAt"|"updatedAt"|"sales"|"slug"|"ratingSum"|"ratingCount"|"averageRating"|"shippingFeeMethod"
>;

// PRODUCT VARIANT SCHEMA DEFINITION
const productVariantSchema = new Schema(
  {
    variantName: { type: String, required: true },
    variantDescription: { type: String },
    variantImage: { type: String, required: true },
    slug: { type: String, required: true },
    isSale: { type: Boolean, default: false },
    saleEndDate: { type: String },
    sku: { type: String, required: true },
    keywords: { type: String, required: true },
    sales: { type: Number, default: 0 },
    product: { type: Schema.ObjectId, ref: "Product", required: true },
    images: [variantImageSchema],
    colors: [variantColorSchema],
    weight: { type: Number, required: true }, // different variant could have different weight
    sizes: [variantSizeSchema],
    specifications: [specificationSchema]
  },
  { timestamps: true }
);

// INDEXING FOR PRODUCT VARIANT
productVariantSchema.index({ slug: "asc" }, { unique: true });
productVariantSchema.index({ product: "asc" });

// DEFAULT SCHEMA TYPE
export type ProductVariantSchema = InferSchemaWithId<typeof productVariantSchema>;

// USE FOR THE RETURNED DATA FROM API RESPONSE
export type IProductVariant = InterfaceFromSchema<ProductVariantSchema>;

// THE MONGOOSE HYDRATED DOCUMENT
export type ProductVariantDoc = HydratedDocument<ProductVariantSchema>;

// USE FOR CREATING NEW DOCUMENT
export type ProductVariantRawSchema = PartialSchema<
  ProductVariantSchema,
  "_id" | "createdAt" | "updatedAt" | "isSale" | "sales"
>;

// MODELS
export const ProductVariant =
  models.ProductVariant || model("ProductVariant", productVariantSchema);

const Product = models.Product || model("Product", productSchema);
export default Product;
