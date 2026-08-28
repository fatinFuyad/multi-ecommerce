import { PrettifyType } from "@/lib/types";
import {
  HydratedDocument,
  InferSchemaType,
  MergeType,
  model,
  models,
  Schema,
  Types
} from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },
    variants: [{ type: Schema.Types.ObjectId, ref: "ProductVariant", required: true }],
    offerTag: { type: Schema.Types.ObjectId, ref: "OfferTag" },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true
    },
    specifications: [
      {
        name: {
          type: String,
          required: true
        },
        value: { type: String, required: true }
      }
    ],
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

// INDEXING FOR PRODUCT
productSchema.index({ slug: "asc" }, { unique: true });
productSchema.index({ store: "asc" });

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
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "productImage" },
        order: { type: Number }
      }
    ],
    colors: [
      {
        color: {
          type: String,
          required: true
        }
      }
    ],
    sizes: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: true }
      }
    ],
    specifications: [
      {
        name: {
          type: String,
          required: true
        },
        value: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

// INDEXING FOR PRODUCT VARIANT
productVariantSchema.index({ slug: "asc" }, { unique: true });
productVariantSchema.index({ product: "asc" });

// returned data type from backend
export type IProduct = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

// returned data type from database to backend
export type ProductDoc = HydratedDocument<MergeType<IProduct, { _id: Types.ObjectId }>>;

// prettier-ignore
// required data type to create a doc in database
export type ProductSchema = PrettifyType<
  MergeType<IProduct,
    Partial<Pick<IProduct, "rating" | "sales" | "createdAt" | "updatedAt" | "_id">>
  >
>;

export type IProductVariant = InferSchemaType<typeof productVariantSchema> & {
  _id: Types.ObjectId;
};
export type ProductVariantDoc = HydratedDocument<
  MergeType<IProductVariant, { _id: Types.ObjectId }>
>;

// prettier-ignore
export type ProductVariantSchema = PrettifyType<
  MergeType<IProductVariant,
    Partial<Pick<IProductVariant, "isSale" | "sales" | "createdAt" | "updatedAt" | "_id">>
  >
>;

export const ProductVariant =
  models.ProductVariant<IProductVariant> ||
  model<IProductVariant>("ProductVariant", productVariantSchema);

const Product = models.Product<IProduct> || model<IProduct>("Product", productSchema);
export default Product;
