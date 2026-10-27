"use server";

import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { SubcategoryFormSchemaType } from "@/lib/schemas";
import { Aggregate, Query, Types } from "mongoose";

import { restrictTo } from "@/lib/auth";
import Category from "@/models/Category";
import Subcategory, {
  ISubcategory,
  SubcategoryRawSchema,
  SubcategorySchema
} from "@/models/Subcategory";

/**
 * @description: Creates or updates a subcategory into the database
 * @protected Level: Admin only
 * @param: subcategory: Subcategory object containing details of the subcategory to be upserted.
 * @returns: Updated or newly created subcategory details.
 */
export async function upsertSubcategory(subcategoryFormData: SubcategoryFormSchemaType) {
  if (!subcategoryFormData) throw new Error("Subcategory data can't be empty");
  const isUpdateSession = Boolean(subcategoryFormData._id);
  const subcategoryId = subcategoryFormData._id
    ? new Types.ObjectId(subcategoryFormData._id)
    : new Types.ObjectId();
  const categoryId = new Types.ObjectId(subcategoryFormData.category);

  // check whether subcategory with same name or URL already exists
  let existingSubcategory: SubcategorySchema | null;
  if (isUpdateSession) {
    existingSubcategory = await Subcategory.findOne({
      $or: [{ name: subcategoryFormData.name }, { url: subcategoryFormData.url }],
      $nor: [{ _id: subcategoryFormData._id }]
    }).lean<SubcategorySchema>();
  } else {
    existingSubcategory = await Subcategory.findOne({
      $or: [{ name: subcategoryFormData.name }, { url: subcategoryFormData.url }]
    }).lean<SubcategorySchema>();
  }

  // Throw error if subcategory with same name or URL already exists
  if (existingSubcategory) {
    let errorMessage = "";
    if (existingSubcategory.name === subcategoryFormData.name) {
      errorMessage = "A subcategory with the same name already exists";
    } else if (existingSubcategory.url === subcategoryFormData.url) {
      errorMessage = "A subcategory with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  let newSubcategory: SubcategorySchema | null;
  const subcategoryData = {
    name: subcategoryFormData.name,
    url: subcategoryFormData.url,
    image: subcategoryFormData.image[0].url,
    category: categoryId,
    featured: subcategoryFormData.featured
  };

  if (isUpdateSession) {
    newSubcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      subcategoryData satisfies Partial<SubcategoryRawSchema>, // updates do not require all schema fields
      { new: true }
    ).lean<SubcategorySchema>();
  } else {
    newSubcategory = await Subcategory.create(
      subcategoryData satisfies SubcategoryRawSchema
    );

    if (newSubcategory) {
      await Category.updateOne(
        { _id: categoryId },
        {
          $push: { subcategories: newSubcategory._id }
        }
      );
    }
  }

  if (!newSubcategory) throw new Error("No subcategory found to upsert");
  return JSON.parse(JSON.stringify(newSubcategory)) as ISubcategory;
}

/**
 * @description: Retrieves all subcategories from the database.
 * @protected Level: Public
 * @returns: Array of subcategories sorted by updatedAt date in descending order.
 */
export async function getSubcategories<T = ISubcategory>(
  queryStr: string = "",
  options: Record<string, any> = {}
): Promise<T[]> {
  await dbConnect();

  const query = new QueryBuilder(Subcategory.find(), queryStr);
  let dbQuery: Aggregate<any[]> | Query<any[], any> = query.build();
  if (queryStr) {
    dbQuery = query.filter().limitFields().paginate().populateDoc(options).build();
  }

  if (options.sample)
    dbQuery = Subcategory.aggregate([
      { $sample: { size: Number(options.sample) } },
      { $project: { name: 1, url: 1, featured: 1 } },
      { $sort: { featured: -1 } }
    ]);

  const subcategories = await dbQuery;
  return JSON.parse(JSON.stringify(subcategories)) as T[];
}

/**
 * @description Retrieves a specific subcategory from the database.
 * @access Public
 * @param subcategoryId The ID of the subcategory to be retrieved.
 * @returns: Details of the requested subcategory.
 */
export async function getSubcategoryById(subcategoryId: string) {
  await dbConnect();

  const subcategory = await Subcategory.findById(subcategoryId).lean<SubcategorySchema>();
  if (!subcategory) throw new Error("No subcategory found with the _id");

  return JSON.parse(JSON.stringify(subcategory)) as ISubcategory;
}

/**
 * @description Deletes a subcategory from the database.
 * @access Permission Level: Admin only
 * @param subcategoryId The ID of the subcategory to be deleted.
 * @returns: Response indicating success or failure of the deletion operation.
 */
export async function deleteSubcategory(subcategoryId: string) {
  // Verify admin permission
  await restrictTo("ADMIN");
  await dbConnect();

  await Subcategory.findByIdAndDelete(subcategoryId);
  return null;
}
