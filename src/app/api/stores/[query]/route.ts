import { dbConnect } from "@/lib/dbConnect";
import { StoreFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import Store, { IStore, StoreDoc } from "@/models/Store";
import { Types } from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { query: Types.ObjectId } }
) {
  try {
    // await restrictToSeller();
    await dbConnect();

    const store: StoreFormSchemaType = await req.json();

    // Seller can use same email or phone number for other stores as well
    const existingStore = await Store.findOne({
      $or: [{ name: store.name }, { url: store.url }],
      $nor: [{ _id: params.query }]
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
    const newStore = await Store.findByIdAndUpdate(params.query, {
      ...store,
      logo: store.logo[0].url,
      cover: store.logo[0].url
      // featured:false, // should admin make store featured ?
    } satisfies Pick<IStore, keyof StoreFormSchemaType>);

    return Response.json(
      {
        store: newStore,
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

// the dynamic param query is url but it might receive other query params to find store
export async function GET(
  req: Request,
  { params }: { params: { query: string } }
) {
  try {
    // console.log("query file====>", new URL(req.url));
    // from the client a custom header query is sent to find store

    const findBy: string = req.headers.get("query") || "_id";
    const store = await Store.findOne({ [findBy]: params.query });

    return Response.json(
      {
        store: store,
        success: true,
        status: 201,
        message: "Get store was successful"
      } satisfies ApiResponse<{ store: StoreDoc }>,
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
