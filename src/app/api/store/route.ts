import { dbConnect } from "@/lib/dbConnect";
import { StoreFormSchema } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import Store, { IStore, StoreData } from "@/models/Store";
import z from "zod";
import { restrictTo } from "../apiUtils";

// Function: Upserts store details into the database, ensuring uniqueness of name,url, email, and phone number.
// Access Level: Seller Only
// Parameters:
//   - store: Partial store object containing details of the store to be upserted.
// Returns: Updated or newly created store details.

export async function POST(req: Request) {
  try {
    const seller = await restrictTo("SELLER");

    const store: z.infer<typeof StoreFormSchema> & { user: string } =
      await req.json();

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
      status: "PENDING"
      // featured:false, // should admin make store featured ?
    } satisfies IStore;
    console.log(storeData);
    const newStore = await Store.create(storeData);

    return Response.json(
      {
        data: newStore,
        success: true,
        status: 201
      } satisfies ApiResponse<StoreData | null>,
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        data: null,
        success: false,
        status: 500,
        message: error.message || "An error occured while creating the store"
      } satisfies ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const stores = await Store.find();
    return Response.json(
      {
        data: stores,
        success: true,
        status: 200
      } satisfies ApiResponse<StoreData[]>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        data: [],
        success: false,
        status: 500,
        message: error.message || "An error occured while getting the store"
      } satisfies ApiResponse<[]>,
      { status: 500 }
    );
  }
}
