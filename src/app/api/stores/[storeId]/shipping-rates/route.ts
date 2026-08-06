import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { ShippingRateFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import { Country, ICountry, IShippingRate, ShippingRate } from "@/models/Shipping-Rate";
import { Types } from "mongoose";

/**
 * @description Retrieves all countries and their shipping rates for a specific store.
 * If a country does not have a shipping rate, it is still included in the result with a null shippingRate.
 * @access Permission Level: Public
 * @returns Array of objects where each object contains a country and its associated shippingRate, sorted by country name.
 */
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await dbConnect();
    const countries = await Country.find().lean<ICountry[]>();
    const shippingRates = await ShippingRate.find().lean<IShippingRate[]>();
    // create a new Map and loop over the shippingRates.
    // then set Map Item which contains the countryId as key and the shippingRate as value i.e new Map([ [countryId, shippingRate] ])
    // then map over the countries and for each of the country get the corresponding shippingRate which could be an object or null

    const rateMap = new Map();
    shippingRates.forEach((rate) => {
      rateMap.set(rate.country.toString(), rate);
    });

    const shippingData = countries.map((country) => {
      return {
        storeId: params.storeId,
        country: country,
        shippingRate: rateMap.get(country._id.toString())
      };
    });

    return Response.json(
      {
        shippingRates: shippingData,
        success: true,
        status: 200,
        message: "Get shipping rates for a specific store with country data included."
      } satisfies ApiResponse<{
        shippingRates: {
          storeId: string;
          country: ICountry;
          shippingRate: IShippingRate | null;
        }[];
      }>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        shippingRates: [],
        success: false,
        status: 500,
        message: error.message
      } satisfies ApiResponse<{ shippingRates: [] }>,
      { status: 500 }
    );
  }
}

/**
 * @description Upserts a shipping rate for a specific country, updating if it exists or creating a new one if not.
 * @access Permission Level: Seller only
 * @param storeId _id of the store you are trying to update.
 * @param shippingRate ShippingRate object containing the details of the shipping rate to be upserted.
 * @returns Updated or newly created shipping rate
 */
export async function PUT(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await restrictTo("SELLER");
    await dbConnect();

    const shippingData: ShippingRateFormSchemaType = await req.json();
    console.log(shippingData);
    if (typeof shippingData !== "object" || Object.keys(shippingData).length === 0)
      throw new Error("Shipping rate data should not be empty");

    const updatedShippingRate = await ShippingRate.findOneAndUpdate(
      {
        store: params.storeId,
        country: shippingData.countryId
      },
      { $set: shippingData },
      { upsert: true, new: true }
    );

    return Response.json(
      {
        shippingRate: updatedShippingRate,
        success: true,
        status: 200,
        message: "Shipping rate for a specific store with country has been upserted."
      } satisfies ApiResponse<{
        shippingRate: {
          _id: Types.ObjectId;
          countryName: string;
          shippingRate: any;
        }[];
      }>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        shippingRate: null,
        success: false,
        status: 500,
        message: error.message
      } satisfies ApiResponse<{ shippingRate: null }>,
      { status: 500 }
    );
  }
}
