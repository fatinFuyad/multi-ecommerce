import { HydratedDocument, InferSchemaType, model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },
    variants: [{ type: Schema.Types.ObjectId, ref: "ProductVariant", required: true }],

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "subcategory",
      required: true
    }
  },
  {
    timestamps: true
  }
);

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

    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
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

    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "ImgOfPrdt" },
        order: { type: Number }
      }
    ]
  },
  { timestamps: true }
);

export type IProduct = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};
export type ProductDoc = HydratedDocument<IProduct>;

export type IProductVariant = InferSchemaType<typeof productVariantSchema> & {
  _id: Types.ObjectId;
};
export type ProductVariantDoc = HydratedDocument<IProductVariant>;

export const ProductVariant = model<IProductVariant>(
  "ProductVariant",
  productVariantSchema
);

const Product = model<IProduct>("Product", productSchema);
export default Product;
