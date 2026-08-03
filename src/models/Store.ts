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
    shippingService: { type: String, default: "International Delivery" },
    deliveryTimeMin: { type: Number, default: 7 },
    deliveryTimeMax: { type: Number, default: 31 },
    shippingFeePerItem: { type: Number, default: 0 },
    shippingFeeForAdditionalItem: { type: Number, default: 0 },
    shippingFeePerKg: { type: Number, default: 0 },
    shippingFeeFixed: { type: Number, default: 0 }
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
        IStore, "averageRating"|"returnPolicy"|"shippingService"|"deliveryTimeMin"|"status"|"deliveryTimeMax"|"shippingFeePerItem"|"shippingFeeForAdditionalItem"|"shippingFeePerKg"|"shippingFeeFixed"|"createdAt"|"updatedAt"| "_id"
      >
    >
  >
>;

const Store = models.Store || model<IStore>("Store", storeSchema);

export default Store;
