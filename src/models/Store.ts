import {
  InferSchemaWithId,
  InterfaceFromSchema,
  PartialSchema,
  PrettifyType
} from "@/lib/types";
import { HydratedDocument, Schema, model, models } from "mongoose";

type StoreStatus = "PENDING" | "ACTIVE" | "BANNED" | "DISABLED";

// STORE SCHEMA DEFINITION
const storeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, required: true },
    url: { type: String, required: true },
    logo: { type: String, required: true },
    cover: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "BANNED", "PENDING", "DISABLED"] satisfies StoreStatus[],
      default: "PENDING",
      required: true
    },
    featured: { type: Boolean, required: true },
    averageRating: { type: Number, required: true, default: 0 },
    followers: { type: Number, default: 0 },
    returnPolicy: { type: String, default: "Return in 30 days." },
    defaultShippingService: { type: String, default: "International Delivery" },
    defaultShippingFeePerItem: { type: Number, default: 0 },
    defaultShippingFeeForAdditionalItem: { type: Number, default: 0 },
    defaultShippingFeePerKg: { type: Number, default: 0 },
    defaultShippingFeeFixed: { type: Number, default: 0 },
    defaultDeliveryTimeMin: { type: Number, default: 7 },
    defaultDeliveryTimeMax: { type: Number, default: 31 }
  },
  {
    timestamps: true
  }
);

// INDEXING FOR STORE
storeSchema.index({ name: "asc" }, { unique: true });
storeSchema.index({ email: "asc" }, { unique: true });
storeSchema.index({ url: "asc" }, { unique: true });
storeSchema.index({ user: "asc" });

export type StoreSchema = InferSchemaWithId<typeof storeSchema>;
export type IStore = InterfaceFromSchema<StoreSchema>;
export type StoreDoc = HydratedDocument<StoreSchema>;

// prettier-ignore
export type StoreRawSchema = PartialSchema<StoreSchema, "averageRating"|"returnPolicy"|"defaultShippingService"|"defaultDeliveryTimeMin"|"status"|"defaultDeliveryTimeMax"|"defaultShippingFeePerItem"|"defaultShippingFeeForAdditionalItem"|"defaultShippingFeePerKg"|"defaultShippingFeeFixed"|"createdAt"|"updatedAt"|"_id">

// prettier-ignore
export type StoreShippingType = PrettifyType<
  Pick<StoreSchema, "returnPolicy"|"defaultShippingService"|"defaultDeliveryTimeMin"|"defaultDeliveryTimeMax"|"defaultShippingFeePerItem"|"defaultShippingFeeForAdditionalItem"|"defaultShippingFeePerKg"|"defaultShippingFeeFixed"|"_id">
>;

const Store = models.Store || model<StoreSchema>("Store", storeSchema);

export default Store;

// STORE FOLLOWER SCHEMA DEFINITION
const storeFollowerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    store: { type: Schema.Types.ObjectId, required: true, ref: "Store" }
  },
  { timestamps: true }
);

// INDEXING
storeFollowerSchema.index({ user: "asc" });
storeFollowerSchema.index({ store: "asc" });
storeFollowerSchema.index({ user: "asc", store: "asc" }, { unique: true }); // compound indexing for unique follow doc

// types
export type StoreFollowerSchema = InferSchemaWithId<typeof storeFollowerSchema>;
export type IStoreFollower = InterfaceFromSchema<StoreFollowerSchema>;

export const StoreFollower =
  models.StoreFollower ||
  model<StoreFollowerSchema>("StoreFollower", storeFollowerSchema);
