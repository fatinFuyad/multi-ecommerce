import {
  InferSchemaWithId,
  InterfaceFromSchema,
  MergeType,
  PartialSchema
} from "@/lib/types";
import { model, models, Schema } from "mongoose";
import { ICountry } from "./Shipping-Rate";

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
    price: { type: Number, required: true },
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
export type CartSchema = InferSchemaWithId<typeof cartSchema>;
export type ICart = InterfaceFromSchema<CartSchema>;
export type CartRawSchema = PartialSchema<CartSchema, "createdAt" | "updatedAt" | "_id">;

// MODEL
export const Cart = models.Cart || model("Cart", cartSchema);

const shippingAddressSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
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
export type UserShippingAddressType = MergeType<IShippingAddress, { country: ICountry }>;
export type ShippingAddressRawSchema = PartialSchema<
  ShippingAddressSchema,
  "createdAt" | "updatedAt" | "_id"
>;

// MODEL
export const ShippingAddress =
  models.ShippingAddress || model("ShippingAddress", shippingAddressSchema);

const orderStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "OutforDelivery",
  "Delivered",
  "Cancelled",
  "Failed",
  "Refunded",
  "Returned",
  "PartiallyShipped",
  "OnHold"
] as const;

const paymentStatuses = [
  "Pending",
  "Paid",
  "Failed",
  "Declined",
  "Cancelled",
  "Refunded",
  "PartiallyRefunded",
  "Chargeback"
] as const;

export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];

const orderSchema = new Schema(
  {
    shippingFees: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    // groups OrderGroup[] @relation("OrderGroupToOrder")
    groups: [{ type: Schema.ObjectId, ref: "OrderGroup", required: true }],
    orderStatus: { type: String, enum: orderStatuses, default: "Pending" },
    paymentStatus: { type: String, enum: paymentStatuses, default: "Pending" },
    shippingAddress: { type: Schema.ObjectId, ref: "ShippingAddress", required: true },
    user: { type: Schema.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);
// @@index([shippingAddressId])
// @@index([userId])
orderSchema.index({ shippingAddress: "asc" });
orderSchema.index({ user: "asc" });

// TYPES
export type OrderSchema = InferSchemaWithId<typeof orderSchema>;
export type IOrder = InterfaceFromSchema<OrderSchema>;
export type OrderRawSchema = PartialSchema<
  OrderSchema,
  "createdAt" | "updatedAt" | "_id" | "orderStatus" | "paymentStatus"
>;

/**
 * @name Order model
 * @description The main Order model. User makes the checkout and this main order is created that has orderGroups which is store specific vendor-orders.
 */
export const Order = models.Order || model("Order", orderSchema);

const orderGroupSchema = new Schema(
  {
    status: { type: String, enum: orderStatuses, default: "Pending" },
    // items: OrderItem[] @relation("OrderItemToGroup")
    items: [{ type: Schema.ObjectId, ref: "OrderItem", required: true }],
    shippingService: { type: String, required: true },
    shippingDeliveryMin: { type: Number, required: true },
    shippingDeliveryMax: { type: Number, required: true },
    shippingFees: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    order: { type: Schema.ObjectId, ref: "Order", required: true },
    //  Order  @relation("OrderGroupToOrder", fields: [orderId], references: [id])
    store: { type: Schema.ObjectId, ref: "Store", required: true }
  },
  { timestamps: true }
);

orderGroupSchema.index({ order: "asc" });
orderGroupSchema.index({ store: "asc" });

// TYPES
export type OrderGroupSchema = InferSchemaWithId<typeof orderGroupSchema>;
export type IOrderGroup = InterfaceFromSchema<OrderGroupSchema>;
export type OrderGroupRawSchema = PartialSchema<
  OrderGroupSchema,
  "createdAt" | "updatedAt" | "_id" | "status"
>;

/**
 * @name OrderGroup Model
 * @description The order group model is store specific and it has the required data for making an order to a store. It has order-items and store shipping details for an order-group
 */
export const OrderGroup = models.OrderGroup || model("OrderGroup", orderGroupSchema);

const orderItemSchema = new Schema(
  {
    product: { type: Schema.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.ObjectId, ref: "Variant", required: true },
    size: { type: Schema.ObjectId, required: true },
    productSlug: { type: String, required: true },
    variantSlug: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    productSize: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    shippingFee: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    orderGroup: { type: Schema.ObjectId, ref: "OrderGroup", required: true }
    // @relation("OrderItemToGroup", fields: [orderGroupId], references: [id], onDelete: Cascade)
  },
  { timestamps: true }
);
// @@index([orderGroupId])
orderItemSchema.index({ orderGroup: "asc" });

// TYPES
export type OrderItemSchema = InferSchemaWithId<typeof orderItemSchema>;
export type IOrderItem = InterfaceFromSchema<OrderItemSchema>;
export type OrderItemRawSchema = PartialSchema<
  OrderItemSchema,
  "createdAt" | "updatedAt" | "_id"
>;

/**
 * @name OrderItem Model
 * @description OrderItem contains the details of ordered products from a store. It holds the reference of OrderGroups which it belongs to.
 */
export const OrderItem = models.OrderItem || model("OrderItem", orderItemSchema);
