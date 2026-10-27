"use server";

import { restrictTo } from "@/lib/auth";
import { dbConnect } from "@/lib/db-connect";
import { CategoryFormSchemaType } from "@/lib/schemas";
import Category, {
  CategoryDoc,
  CategoryRawSchema,
  CategorySchema,
  ICategory
} from "@/models/Category";
import { Types } from "mongoose";

/**
 * @description Creates or updates a category into the database
 * @access Permission Admin only
 * @param category Category object containing details of the category to be upserted.
 * @returns: Updated or newly created category details.
 */
export async function upsertCategory(categoryFormData: CategoryFormSchemaType) {
  // Verify admin permission
  await restrictTo("ADMIN");
  if (!categoryFormData) throw new Error("Category data can't be empty");
  const isUpdateSession = Boolean(categoryFormData._id);
  const categoryId = categoryFormData._id
    ? new Types.ObjectId(categoryFormData._id)
    : new Types.ObjectId();

  // check whether category with same name or URL already exists
  let existingCategory: CategoryDoc | null;
  if (isUpdateSession) {
    existingCategory = await Category.findOne({
      $or: [{ name: categoryFormData.name }, { url: categoryFormData.url }],
      $nor: [{ _id: categoryFormData._id }]
    });
  } else {
    existingCategory = await Category.findOne({
      $or: [{ name: categoryFormData.name }, { url: categoryFormData.url }]
    });
  }

  // Throw error if category with same name or URL already exists
  if (existingCategory) {
    let errorMessage = "";
    if (existingCategory.name === categoryFormData.name) {
      errorMessage = "A category with the same name already exists";
    } else if (existingCategory.url === categoryFormData.url) {
      errorMessage = "A category with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  const categoryData = {
    name: categoryFormData.name,
    image: categoryFormData.image[0].url,
    url: categoryFormData.url,
    featured: categoryFormData.featured
  };

  let newCategory: CategorySchema | null;
  if (isUpdateSession) {
    newCategory = await Category.findByIdAndUpdate(
      categoryId,
      categoryData satisfies Partial<CategoryRawSchema>, // updates do not require all schema fields
      { new: true }
    ).lean<CategorySchema>();
  } else {
    newCategory = await Category.create({
      ...categoryData,
      _id: categoryId,
      subcategories: []
    } satisfies CategoryRawSchema);
  }

  if (!newCategory) throw new Error("No category found to upsert updates!");
  return JSON.parse(JSON.stringify(newCategory)) as ICategory;
}
/**
 * @description Retrieves all categories from the database.
 * @access Permission Level: Public
 * @returns Array of categories sorted by updatedAt date in descending order.
 */
export async function getCategories() {
  await dbConnect();
  const categories = await Category.find().sort({ updatedAt: -1 });
  return JSON.parse(JSON.stringify(categories)) as ICategory[];
}

/**
 * @description Retrieves a specific category from the database.
 * @access Permission Level: Public
 * @param categoryId The ID of the category to be retrieved.
 * @returns Details of the requested category.
 */

export async function getCategoryById(categoryId: string) {
  await dbConnect();
  const category = await Category.findById(new Types.ObjectId(categoryId)).lean();
  return JSON.parse(JSON.stringify(category)) as ICategory;
}
/**
 * @description Deletes a category from the database.
 * @access Permission Level: Admin only
 * @param categoryId The ID of the category to be deleted.
 * @returns Response indicating success or failure of the deletion operation.
 */
export async function deleteCategory(categoryId: string) {
  // Verify admin permission
  await restrictTo("ADMIN");

  await Category.findByIdAndDelete(categoryId);
  return null;
}
