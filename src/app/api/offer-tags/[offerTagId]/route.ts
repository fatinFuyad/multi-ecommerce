import OfferTag, { IOfferTag } from "@/models/OfferTag";

import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { ApiResponse } from "@/lib/types";
import { Types } from "mongoose";

interface RouteParams {
  params: {
    offerTagId: string; // in params _id is string not ObjectId
  };
}

/**
 * @description Retrieves a specific OfferTag from the database.
 * @access Level Public
 * @param offerTagId The ID of the OfferTag to be retrieved.
 * @returns Details of the requested OfferTag.
 */
export async function GET(req: Request, { params: { offerTagId } }: RouteParams) {
  try {
    // Connect databse
    await dbConnect();

    // Ensure offerTag ID is provided
    if (!offerTagId) throw new Error("Please provide offer tag ID.");

    // Retrieve the offer tag from the database using the provided ID
    const query = new QueryBuilder(
      OfferTag.findOne({ _id: new Types.ObjectId(offerTagId) }),
      req.url
    )
      .limitFields()
      .handleQueryOptions(req.headers)
      .build();

    const offerTag = (await query) as unknown as IOfferTag;
    return Response.json(
      {
        offerTag,
        success: true,
        status: 200,
        message: "Get offer tag from db collection successfully."
      } satisfies ApiResponse<{ offerTag: IOfferTag }>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        offerTag: null,
        success: false,
        status: 404,
        message: error.message
      } satisfies ApiResponse<{ offerTag: null }>,
      { status: 404 }
    );
  }
}

/**
 * @description Deletes an offer tag from the database by its ID.
 * @access Permission Level Admin only
 * @param offerTagId The ID of the offer tag to be deleted.
 * @returns A success message if the offer tag is deleted, or an error if it fails.
 */
export async function DELETE(req: Request, { params: { offerTagId } }: RouteParams) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");
    // Connect databse
    await dbConnect();

    // Ensure the offerTagId is provided
    if (!offerTagId) throw new Error("Please provide the offer tag ID.");

    // Delete offer tag from the database
    await OfferTag.findByIdAndDelete(offerTagId);
    return Response.json(
      {
        offerTag: null,
        success: true,
        status: 204,
        message: "Offer tag has been deleted from database successfully."
      } satisfies ApiResponse<{ offerTag: null }>,
      { status: 204 }
    );
  } catch (error: any) {
    return Response.json(
      {
        offerTag: null,
        success: false,
        status: 500,
        message: error.message
      } satisfies ApiResponse<{ offerTag: null }>,
      { status: 500 }
    );
  }
}
