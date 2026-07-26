import Store, { IStore, StoreDoc } from "@/models/Store";
import User from "@/models/User";

import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { StoreFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";

// Function: Upserts store details into the database, ensuring uniqueness of name,url, email, and phone number.
// Access Level: Seller Only
// Parameters:
//   - store: Partial store object containing details of the store to be upserted.
// Returns: Updated or newly created store details.

export async function POST(req: Request) {
  try {
    const seller = await restrictTo("SELLER");

    const store: StoreFormSchemaType = await req.json();

    // Seller can use same email or phone number for other stores as well
    const existingStore = await Store.findOne({
      $or: [{ name: store.name }, { url: store.url }]
    });

    // Throw error if store with same name or URL already exists
    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exists";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    if (typeof store !== "object" || Object.keys(store).length === 0)
      throw new Error("Store data should not be empty");
    const storeData = {
      ...store,
      logo: store.logo[0].url,
      cover: store.logo[0].url,
      user: seller._id,
      averageRating: 0,
      status: "PENDING",
      featured: false, // should admin make stores featured??
      returnPolicy: "No Return Policy",
      defaultShippingService: "No Default Service",
      defaultDeliveryFees: null,
      defaultDeliveryTimeMin: null,
      defaultDeliveryTimeMax: null
    } satisfies Omit<IStore, "_id" | "createdAt" | "updatedAt">;

    const newStore: StoreDoc = await Store.create(storeData);

    // After creating store update seller data;
    await User.findByIdAndUpdate(seller._id, {
      $push: { stores: newStore._id }
    });
    return Response.json(
      {
        store: newStore,
        success: true,
        status: 201
      } satisfies ApiResponse<{ store: StoreDoc }>,
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        store: null,
        success: false,
        status: 500,
        message: error.message || "An error occured while creating the store"
      } satisfies ApiResponse<{ store: null }>,
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    //  await restrictTo('SELLER')
    await dbConnect();
    const query = new QueryBuilder(Store.find(), req.url)
      .filter()
      .limitFields()
      .sort()
      .paginate()
      .build();
    const stores = await query;

    return Response.json(
      {
        total: stores.length,
        success: true,
        status: 200,
        message: "Get store was successful",
        stores
      } satisfies ApiResponse<{ stores: StoreDoc[] }>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        stores: [],
        success: false,
        status: 500,
        message: error.message || "An error occured while querying the stores"
      } satisfies ApiResponse<{ stores: [] }>,
      { status: 500 }
    );
  }
}
