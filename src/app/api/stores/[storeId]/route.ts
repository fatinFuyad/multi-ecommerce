import Store, { IStore, StoreDoc } from "@/models/Store";
import { Types } from "mongoose";

import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { StoreFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import StoreDetails from "@/components/dashboard/forms/store-details";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: Types.ObjectId } }
) {
  try {
    await restrictTo("SELLER");
    await dbConnect();

    const store: StoreFormSchemaType = await req.json();

    // Seller can use same email or phone number for other stores as well
    const existingStore = await Store.findOne({
      $or: [{ name: store.name }, { url: store.url }],
      $nor: [{ _id: params.storeId }]
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
    const updatedStore = await Store.findByIdAndUpdate(
      params.storeId,
      {
        ...store,
        logo: store.logo[0].url,
        cover: store.logo[0].url
        // featured:false, // should admin make store featured ?
      } satisfies Pick<IStore, keyof StoreFormSchemaType>,
      { new: true }
    );

    return Response.json(
      {
        store: updatedStore,
        success: true,
        status: 201,
        message: "Store updated successfully"
      } satisfies ApiResponse<{ store: StoreDoc }>,
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        store: null,
        success: false,
        status: 500,
        message: error.message || "An error occured while updating the store"
      } satisfies ApiResponse<{ store: null }>,
      { status: 500 }
    );
  }
}

// the dynamic param storeId is url but it might receive other storeId params to find store
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // console.log("storeId file====>", new URL(req.url));
    // from the client a custom header storeId is sent to find store

    // const findBy: string = req.headers.get("storeId") || "_id";
    // const store = await Store.findOne({ [findBy]: params.storeId });

    const store = await Store.findById(params.storeId);

    return Response.json(
      {
        store: store,
        success: true,
        status: 201,
        message: "Get store was successful",
        _id: params.storeId,
        type: typeof params.storeId
      } satisfies ApiResponse<{ store: StoreDoc; _id: any; type: any }>,
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        stores: null,
        success: false,
        status: 500,
        message: error.message || "An error occured while querying the store"
      } satisfies ApiResponse<{ stores: null }>,
      { status: 500 }
    );
  }
}
