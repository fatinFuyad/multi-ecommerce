"use server";

import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { ShippingRateFormSchemaType } from "@/lib/schemas";
import { InterfaceFromSchema } from "@/lib/types";
import {
  Country,
  CountrySchema,
  IShippingRate,
  ShippingRate,
  ShippingRateSchema
} from "@/models/Shipping-Rate";
import { Types } from "mongoose";

/**
 * @description Retrieves all countries and their shipping rates for a specific store.
 * If a country does not have a shipping rate, it is still included in the result with a null shippingRate.
 * @access Permission Level: Public
 * @returns Array of objects where each object contains a country and its associated shippingRate, sorted by country name.
 */
export async function getStoreShippingRate(storeId: string) {
  await dbConnect();
  const [countries, shippingRates] = await Promise.all([
    Country.find().lean<CountrySchema[]>(),
    ShippingRate.find({ store: storeId }).lean<ShippingRateSchema[]>()
  ]);

  /*
   * create a new Map and loop over the shippingRates.
   * then set Map Item which contains the countryId as key and the shippingRate as value i.e new Map([ [countryId, shippingRate] ])
   * then map over the countries and for each of the country get the corresponding shippingRate which could be an object or null
   */
  const rateMap = new Map();
  shippingRates.forEach((rate) => {
    rateMap.set(rate.country.toString(), rate);
  });

  const shippingData = countries.map((country) => {
    return {
      storeId: storeId,
      country: country,
      countryName: country.name,
      shippingRate: rateMap.get(country._id.toString())
    };
  });

  const countryShippingRate = JSON.parse(
    JSON.stringify(shippingData)
  ) as InterfaceFromSchema<typeof shippingData>;

  return countryShippingRate;
}

/**
 * @description Upserts a shipping rate for a specific country, updating if it exists or creating a new one if not.
 * @access Permission Level: Seller only
 * @param storeId _id of the store you are trying to update.
 * @param shippingRate ShippingRate object containing the details of the shipping rate to be upserted.
 * @returns upserted shipping rate
 */
export async function upsertShippingRate(
  storeId: string,
  shippingFormData: ShippingRateFormSchemaType
) {
  await restrictTo("SELLER");

  if (typeof shippingFormData !== "object" || Object.keys(shippingFormData).length === 0)
    throw new Error("Shipping rate data should not be empty");

  const newShppingRate = await ShippingRate.findOneAndUpdate<ShippingRateSchema>(
    {
      store: new Types.ObjectId(storeId),
      country: new Types.ObjectId(shippingFormData.countryId)
    },
    { $set: shippingFormData },
    { upsert: true, new: true }
  ).lean<ShippingRateSchema>();

  if (!newShppingRate) throw new Error("Failed to upsert shipping rate");
  return JSON.parse(JSON.stringify(newShppingRate)) as IShippingRate;
}
