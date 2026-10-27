"use server";

import OfferTag, { IOfferTag, OfferTagSchema } from "@/models/OfferTag";

import { restrictTo } from "@/lib/auth";
import { dbConnect } from "@/lib/db-connect";
import { PopulateQueryOptions, QueryBuilder } from "@/lib/query-builder";
import { OfferTagFormSchemaType } from "@/lib/schemas";
import { Types } from "mongoose";

/**
 
 * @description Upserts an offer tag into the database, updating if it exists or creating a new one if not.
 * @access Admin only
 * @param offerTag OfferTag object containing details of the offer tag to be upserted.
 * @returns Updated or newly created offer tag details.
 */

export async function upsertOfferTag(offerTagFormData: OfferTagFormSchemaType) {
  // Verify admin permission
  await restrictTo("ADMIN");

  // Ensure offer tag data is provided
  if (!Object.keys(offerTagFormData).length) {
    throw new Error("Please provide offer tag data.");
  }

  const existingOfferTag = await OfferTag.findOne({
    $or: [{ name: offerTagFormData.name, url: offerTagFormData.url }]
  }).lean<OfferTagSchema>();

  // Throw error if offer tag with the same name or url already exists
  if (existingOfferTag) {
    let errorMessage = "";
    if (existingOfferTag.name === offerTagFormData.name) {
      errorMessage = "An offer tag with the same name already exists";
    } else if (existingOfferTag.url === offerTagFormData.url) {
      errorMessage = "An offer tag with the same url already exists";
    }
    throw new Error(errorMessage);
  }

  // Upsert offer tag into the database
  const offerTagId = new Types.ObjectId(offerTagFormData._id);
  const newOfferTag = await OfferTag.findByIdAndUpdate(
    offerTagId,
    offerTagFormData satisfies Pick<OfferTagSchema, "name" | "url">,
    {
      upsert: true,
      new: true
    }
  ).lean();

  return JSON.parse(JSON.stringify(newOfferTag)) as IOfferTag;
}

/**
 * @description Retrieves all offer tags from the database.
 * @access Permission Level: Public
 * @returns Array of offer tags sorted by updatedAt date in ascending order.
 */
export async function getOfferTags(queryItem: string | Record<string, any> = {}) {
  // Connect databse
  await dbConnect();

  const query = new QueryBuilder(OfferTag.find(), queryItem);
  const offerTags = await query.filter().build();
  return JSON.parse(JSON.stringify(offerTags)) as IOfferTag[];
}

/**
 * @description Retrieves a specific OfferTag from the database.
 * @access Level Public
 * @param offerTagId The ID of the OfferTag to be retrieved.
 * @returns Details of the requested OfferTag.
 */
export async function getOfferTagById(
  offerTagId: string,
  options: PopulateQueryOptions = {}
) {
  // Connect databse
  await dbConnect();

  // Ensure offerTag ID is provided
  if (!offerTagId) throw new Error("Please provide offer tag ID.");

  // Retrieve the offer tag from the database using the provided ID
  const query = new QueryBuilder(
    OfferTag.findOne({ _id: new Types.ObjectId(offerTagId) }),
    ""
  )
    .populateDoc(options)
    .build();

  const [offerTag] = await query;
  return JSON.parse(JSON.stringify(offerTag)) as IOfferTag;
}

/**
 * @description Deletes an offer tag from the database by its ID.
 * @access Permission Level Admin only
 * @param offerTagId The ID of the offer tag to be deleted.
 * @returns A success message if the offer tag is deleted, or an error if it fails.
 */
export async function deleteOfferTag(offerTagId: string) {
  // Verify admin permission
  await restrictTo("ADMIN");

  // Ensure the offerTagId is provided
  if (!offerTagId) throw new Error("Please provide the offer tag ID.");

  // Delete offer tag from the database
  await OfferTag.findByIdAndDelete(offerTagId);
  return null;
}
