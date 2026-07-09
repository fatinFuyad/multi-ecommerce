import mongoose, { Document } from "mongoose";

type StoreStatus = "PENDING" | "ACTIVE" | "BANNED" | "DISABLED";

export interface IStore {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo: string;
  cover: string;
  status: StoreStatus;
  averageRating: number;
  featured: boolean;
  returnPolicy?: string;
  defaultShippingService?: string;
  defaultDeliveryFees?: number;
  defaultDeliveryTimeMin?: number;
  defaultDeliveryTimeMax?: number;
  user: mongoose.Types.ObjectId;
  createdAt?: Date; //
  updatedAt?: Date;
}

export interface StoreDoc extends Document, Omit<IStore, "_id"> {}

const storeSchema = new mongoose.Schema<StoreDoc>(
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true
  }
);

const Store =
  mongoose.models.Store<StoreDoc> || mongoose.model("Store", storeSchema);

export default Store;
