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
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    logo: { type: String, required: true },
    cover: { type: String, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "BANNED", "PENDING", "DISABLED"] satisfies StoreStatus[],
      required: true
    },
    averageRating: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, required: true },
    returnPolicy: String,
    defaultShippingService: String,
    defaultDeliveryFees: Number,
    defaultDeliveryTimeMin: Number,
    defaultDeliveryTimeMax: Number,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true
  }
);

export type IStore = InferSchemaType<typeof storeSchema> & {
  _id: Types.ObjectId;
};
export type StoreDoc = HydratedDocument<IStore>;

const Store = models.Store || model<IStore>("Store", storeSchema);

export default Store;
