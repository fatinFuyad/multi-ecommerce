import { InferSchemaWithId, InterfaceFromSchema, PartialSchema } from "@/lib/types";
import { model, models, Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, required: true },
    variant: { type: Schema.Types.ObjectId, required: true },
    size: { type: Schema.Types.ObjectId, required: true },
    productSlug: { type: String, required: true },
    variantSlug: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    productSize: { type: String, required: true },
    price: { type: Number },
    quantity: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    totalPrice: { type: Number },
    store: { type: Schema.ObjectId, required: true }
  },
  { timestamps: true }
);

/* @@index([cartId])
   @@index([storeId])
 */

// TYPES
export type CartItemSchema = InferSchemaWithId<typeof cartItemSchema>;
export type ICartItem = InterfaceFromSchema<CartItemSchema>;
export type CartItemRawSchema = PartialSchema<
  CartItemSchema,
  "createdAt" | "updatedAt" | "_id"
>;

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [cartItemSchema],
    shippingFees: { type: Number, default: 0 },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

// INDEXING
cartSchema.index({ user: "asc" });

// TYPES
export type cartSchema = InferSchemaWithId<typeof cartSchema>;
export type ICart = InterfaceFromSchema<cartSchema>;
export type CartRawSchema = PartialSchema<cartSchema, "createdAt" | "updatedAt" | "_id">;

// MODEL
export const Cart = models.Cart || model("Cart", cartSchema);

const shippingAddressSchema = new Schema(
  {
    firstName: { type: String, rerquired: true },
    lastName: { type: String, rerquired: true },
    phone: { type: String, rerquired: true },
    address1: { type: String, rerquired: true },
    address2: { type: String },
    state: { type: String, rerquired: true },
    city: { type: String, rerquired: true },
    zip_code: { type: String, rerquired: true },
    default: { type: Boolean, default: false },
    //   orders Order[] @relation("ShippingAddressToOrder")
    user: { type: Schema.ObjectId, ref: "User", required: true },
    country: { type: Schema.ObjectId, ref: "Country", required: true }
  },
  { timestamps: true }
);

// INDEXING
shippingAddressSchema.index({ country: "asc" });
shippingAddressSchema.index({ user: "asc" });

// TYPES
export type ShippingAddressSchema = InferSchemaWithId<typeof shippingAddressSchema>;
export type IShippingAddress = InterfaceFromSchema<ShippingAddressSchema>;
export type ShippingAddressRawSchema = PartialSchema<
  ShippingAddressSchema,
  "createdAt" | "updatedAt" | "_id"
>;

// MODEL
export const ShippingAddress =
  models.ShippingAddress || model("ShippingAddress", shippingAddressSchema);
