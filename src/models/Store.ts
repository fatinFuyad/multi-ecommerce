import { MergeType, PrettifyType } from "@/lib/types";
import {
  Types,
  Schema,
  models,
  model,
  HydratedDocument,
  InferSchemaType
} from "mongoose";

type StoreStatus = "PENDING" | "ACTIVE" | "BANNED" | "DISABLED";

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

export type IStore = InferSchemaType<typeof storeSchema> & {
  _id: Types.ObjectId;
};
export type StoreDoc = HydratedDocument<IStore>;

// prettier-ignore
export type StoreSchema = PrettifyType<
  MergeType<
    IStore,
    Partial<
      Pick<
        IStore, "averageRating"|"returnPolicy"|"defaultShippingService"|"defaultDeliveryTimeMin"|"status"|"defaultDeliveryTimeMax"|"defaultShippingFeePerItem"|"defaultShippingFeeForAdditionalItem"|"defaultShippingFeePerKg"|"defaultShippingFeeFixed"|"createdAt"|"updatedAt"| "_id"
      >
    >
  >
>;

// prettier-ignore
export type StoreShippingType = PrettifyType<
  Pick<IStore, "returnPolicy"|"defaultShippingService"|"defaultDeliveryTimeMin"|"defaultDeliveryTimeMax"|"defaultShippingFeePerItem"|"defaultShippingFeeForAdditionalItem"|"defaultShippingFeePerKg"|"defaultShippingFeeFixed"|"_id">
>;

const Store = models.Store || model<IStore>("Store", storeSchema);

export default Store;
