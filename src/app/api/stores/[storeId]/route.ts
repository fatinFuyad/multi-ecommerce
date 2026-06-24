import { dbConnect } from "@/lib/dbConnect";
import { StoreFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import Store, { IStore, StoreData } from "@/models/Store";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: mongoose.Types.ObjectId } }
) {
  try {
    // await restrictToSeller();
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
    const newStore = await Store.findByIdAndUpdate(params.storeId, {
      ...store,
      logo: store.logo[0].url,
      cover: store.logo[0].url
      // featured:false, // should admin make store featured ?
    } satisfies Partial<Omit<IStore, "averageRating" | "status">>);

    return Response.json(
      {
        store: newStore,
        success: true,
        status: 201,
        message: "Store updated successfully"
      } satisfies ApiResponse<{ store: StoreData }>,
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
