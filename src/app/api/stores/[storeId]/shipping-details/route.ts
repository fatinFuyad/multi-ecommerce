import Store, { IStore, StoreDoc } from "@/models/Store";

import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { StoreShippingFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const user = await restrictTo("SELLER");
    await dbConnect();

    const storeShippingData: StoreShippingFormSchemaType = await req.json();
    if (
      typeof storeShippingData !== "object" ||
      Object.keys(storeShippingData).length === 0
    )
      throw new Error("Store shipping data should not be empty");

    const updatedStore = await Store.findOneAndUpdate<StoreDoc>(
      { _id: params.storeId, user: user._id },
      {
        ...storeShippingData
      } satisfies Partial<IStore>,
      { new: true }
    );

    if (!updatedStore)
      throw new Error(
        "Make sure you have the permission or ownership of the store to make any changes!"
      );

    return Response.json(
      {
        store: updatedStore,
        success: true,
        status: 201,
        message: "Store shipping details has been updated successfully"
      } satisfies ApiResponse<{ store: StoreDoc }>,
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        store: null,
        success: false,
        status: 500,
        message:
          error.message || "An error occured while updating the Store shipping details"
      } satisfies ApiResponse<{ store: null }>,
      { status: 500 }
    );
  }
}
