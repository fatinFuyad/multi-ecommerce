import OfferTag, { IOfferTag } from "@/models/OfferTag";

import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { ApiResponse } from "@/lib/types";
import { Types } from "mongoose";

/**
 * @name upsertOfferTag
 * @description Upserts an offer tag into the database, updating if it exists or creating a new one if not.
 * @access Admin only
 * @param offerTag OfferTag object containing details of the offer tag to be upserted.
 * @returns Updated or newly created offer tag details.
 */

export async function PUT(req: Request) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");
    await dbConnect();

    // retrieve data from the frontend request
    const offerTag: IOfferTag = await req.json();
    console.log({ offerTag });
    // Ensure offer tag data is provided
    if (!Object.keys(offerTag).length) throw new Error("Please provide offer tag data.");

    const existingOfferTag = await OfferTag.findOne({
      $or: [{ name: offerTag.name, url: offerTag.url }]
    });

    // Throw error if offer tag with the same name or url already exists
    if (existingOfferTag) {
      let errorMessage = "";
      if (existingOfferTag.name === offerTag.name) {
        errorMessage = "An offer tag with the same name already exists";
      } else if (existingOfferTag.url === offerTag.url) {
        errorMessage = "An offer tag with the same url already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert offer tag into the database
    const _id = offerTag._id || new Types.ObjectId();
    const newOfferTag = await OfferTag.findByIdAndUpdate(_id, offerTag, {
      upsert: true,
      new: true
    });
    return Response.json(
      {
        offerTag: newOfferTag,
        success: true,
        status: 200,
        message: "Offer tag upserted into database successfully."
      } satisfies ApiResponse<{ offerTag: IOfferTag }>,
      { status: 200 }
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

/**
 * @description Retrieves all offer tags from the database.
 * @access Permission Level: Public
 * @returns Array of offer tags sorted by updatedAt date in ascending order.
 */
export async function GET(req: Request) {
  try {
    // Connect databse
    await dbConnect();

    const query = new QueryBuilder(OfferTag.find(), req.url);
    const offerTags = await query.filter().handleQueryOptions(req.headers).build();
    return Response.json(
      {
        offerTags,
        success: true,
        status: 200,
        message: "Get offer tag from db collection successfully."
      } satisfies ApiResponse<{ offerTags: IOfferTag[] }>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        offerTags: [],
        success: false,
        status: 500,
        message: error.message
      } satisfies ApiResponse<{ offerTags: [] }>,
      { status: 500 }
    );
  }
}

/*
export  async function getAllOfferTags (storeUrl?: string) {
  let storeId: string | undefined;

  if (storeUrl) {
    // Retrieve the storeId based on the storeUrl
    const store = await db.store.findUnique({
      where: { url: storeUrl }
    });

    // If no store is found, return an empty array or handle as needed
    if (!store) {
      return [];
    }

    storeId = store.id;
  }

  // Retrieve all offer tags from the database
  const offerTgas = await db.offerTag.findMany({
    where: storeId
      ? {
          products: {
            some: {
              storeId: storeId
            }
          }
        }
      : {},
    include: {
      products: {
        select: {
          id: true
        }
      }
    },
    orderBy: {
      products: {
        _count: "desc" // Order by the count of associated products in descending order
      }
    }
  });
  return offerTgas;
};
*/
