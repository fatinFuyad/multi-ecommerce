import {
  InferSchemaWithId,
  InterfaceFromSchema,
  MergeType,
  PartialSchema
} from "@/lib/types";
import { HydratedDocument, model, models, Schema } from "mongoose";

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

export type CountrySchema = InferSchemaWithId<typeof countrySchema>;
export type CountryRawSchema = PartialSchema<
  CountrySchema,
  "_id" | "createdAt" | "updatedAt"
>;
export type CountryDoc = HydratedDocument<CountrySchema>;
export type ICountry = InterfaceFromSchema<CountrySchema>;

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

// MODEL OF SHIPPING RATE
export const ShippingRate =
  models.ShippingRate || model("ShippingRate", shippingRateSchema);

// TYPES FOR SHIPPING RATE
export type ShippingRateSchema = InferSchemaWithId<typeof shippingRateSchema>;
export type ShippingRateRawSchema = PartialSchema<
  ShippingRateSchema,
  "_id" | "createdAt" | "updatedAt"
>;
export type ShippingRateDoc = HydratedDocument<ShippingRateSchema>;
export type IShippingRate = InterfaceFromSchema<ShippingRateSchema>;

// FREE SHIPPING SCHEMA DEFINITION
const freeShippingSchema = new Schema(
  {
    product: { type: Schema.ObjectId, ref: "Product", required: true },
    eligibleCountries: [
      { type: Schema.ObjectId, ref: "FreeShippingCountry", required: true }
    ]
  },
  { timestamps: true }
);

// MODEL OF FREE SHIPPING
export const FreeShipping =
  models.FreeShipping || model("FreeShipping", freeShippingSchema);

// TYPES OF SHIPPING RATE
export type FreeShippingSchema = InferSchemaWithId<typeof freeShippingSchema>;
export type IFreeShipping = InterfaceFromSchema<FreeShippingSchema>;
export type FreeShippingWithCountries = MergeType<
  FreeShippingSchema,
  { eligibleCountries: FreeShippingCountrySchema[] }
>;

const freeShippingCountrySchema = new Schema(
  {
    freeShipping: { type: Schema.ObjectId, ref: "FreeShipping", required: true },
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true }
  },
  { timestamps: true }
);

// MODEL OF FREE SHIPPING COUNTRY
export const FreeShippingCountry =
  models.FreeShippingCountry || model("FreeShippingCountry", freeShippingCountrySchema);

// TYPES OF FREE SHIPPING COUNTRY
export type FreeShippingCountrySchema = InferSchemaWithId<
  typeof freeShippingCountrySchema
>;
export type IFreeShippingCountry = InterfaceFromSchema<FreeShippingCountrySchema>;
