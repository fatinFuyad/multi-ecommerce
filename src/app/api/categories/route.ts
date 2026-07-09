import { dbConnect } from "@/lib/dbConnect";
import { CategoryFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import Category, { CategoryDoc, ICategory } from "@/models/Category";
import mongoose from "mongoose";
import { restrictTo } from "../apiUtils";

// Function: Creates or updates a category into the database
// Permission Level: Admin only
// Parameters:
//   - category: Category object containing details of the category to be upserted.
// Returns: Updated or newly created category details.

export async function createUpdateCategory(
  category: CategoryFormSchemaType & { _id?: mongoose.Types.ObjectId }
): Promise<CategoryDoc | null> {
  if (!category) throw new Error("Category data can't be empty");
  const isUpdateSession = Boolean(category._id);

  // check whether category with same name or URL already exists
  let existingCategory: CategoryDoc | null;
  if (isUpdateSession) {
    existingCategory = await Category.findOne({
      $or: [{ name: category.name }, { url: category.url }],
      $nor: [{ _id: category._id }]
    });
  } else {
    existingCategory = await Category.findOne({
      $or: [{ name: category.name }, { url: category.url }]
    });
  }
  console.log({ existingCategory });

  // Throw error if category with same name or URL already exists
  if (existingCategory) {
    let errorMessage = "";
    if (existingCategory.name === category.name) {
      errorMessage = "A category with the same name already exists";
    } else if (existingCategory.url === category.url) {
      errorMessage = "A category with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  if (isUpdateSession) {
    const updatedCategory: CategoryDoc | null =
      await Category.findByIdAndUpdate(
        category._id,
        { ...category, image: category.image[0].url } satisfies ICategory,
        { new: true }
      );
    return updatedCategory;
  } else {
    const newCategory: CategoryDoc = await Category.create({
      ...category,
      image: category.image[0].url
    } satisfies ICategory);
    return newCategory;
  }
}

// Create category route handler
export async function POST(req: Request) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    const category: CategoryFormSchemaType = await req.json();
    const newCategory = await createUpdateCategory(category);
    return Response.json({ category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.log(error.message || error.errMsg);
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while creating new category."
      },
      { status: 500 }
    );
  }
}

// Function: Retrieves all categories from the database.
// Permission Level: Public
// Returns: Array of categories sorted by updatedAt date in descending order.
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ updatedAt: -1 });
    return Response.json(
      {
        categories,
        success: true,
        message: "Get all categories successfull",
        status: 200
      } satisfies ApiResponse<{
        categories: CategoryDoc[];
      }>,
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return Response.json(
      {
        categories: [],
        success: false,
        message: error.message,
        status: 500
      } satisfies ApiResponse<{ categories: [] }>,
      { status: 500 }
    );
  }
}
