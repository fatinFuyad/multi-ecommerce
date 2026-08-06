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

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

// INDEXING FOR COUNTRY
countrySchema.index({ name: "asc" }, { unique: true });

export type ICountry = InferSchemaType<typeof countrySchema> & {
  _id: Types.ObjectId;
};
export type CountryDoc = HydratedDocument<ICountry>;
export type CountrySchema = PrettifyType<
  MergeType<ICountry, Partial<Pick<ICountry, "createdAt" | "updatedAt" | "_id">>>
>;

export const Country = models.Country || model("Country", countrySchema);

const shippingRateSchema = new Schema(
  {
    shippingService: { type: String, required: true },
    shippingFeePerItem: { type: Number, required: true },
    shippingFeeForAdditionalItem: { type: Number, required: true },
    shippingFeePerKg: { type: Number, required: true },
    shippingFeeFixed: { type: Number, required: true },
    deliveryTimeMin: { type: Number, required: true },
    deliveryTimeMax: { type: Number, required: true },
    returnPolicy: { type: String, required: true },
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true }
  },
  { timestamps: true }
);

// INDEXING FOR SHIPPING RATE
shippingRateSchema.index({ country: "asc" });
shippingRateSchema.index({ store: "asc" });

export type IShippingRate = InferSchemaType<typeof shippingRateSchema> & {
  _id: Types.ObjectId;
};
export type ShippingRateDoc = HydratedDocument<IShippingRate>;
export type ShippingRateSchema = PrettifyType<
  MergeType<
    IShippingRate,
    Partial<Pick<IShippingRate, "createdAt" | "updatedAt" | "_id">>
  >
>;

export const ShippingRate =
  models.ShippingRate || model("ShippingRate", shippingRateSchema);
