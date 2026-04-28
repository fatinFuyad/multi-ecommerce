import { dbConnect } from "@/lib/dbConnect";
import Category, { CategoryData, ICategory } from "@/models/Category";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongoose";

// Function: upsertCategory
// Description: Upserts a category into the database, updating if it exists or creating a new one if not.
// Permission Level: Admin only
// Parameters:
//   - category: Category object containing details of the category to be upserted.
// Returns: Updated or newly created category details.

async function restrictToAdmin() {
  // Ensure user is authenticated
  const user = await currentUser();
  console.log(user);
  if (!user) throw new Error("Unauthenticated. Please sign in to continue.");

  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );
}

interface ReqCategory extends ICategory {
  _id?: ObjectId;
}

async function createUpdateCategory(
  category: ReqCategory
): Promise<CategoryData | null> {
  if (!category) throw new Error("Category data can't be empty");

  // check database connection
  await dbConnect();

  const isUpdateSession = Boolean(category._id);
  // check whether category with same name or URL already exists
  let existingCategory: CategoryData | null;
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
    const updatedCategory = await Category.findByIdAndUpdate<CategoryData>(
      category._id,
      category,
      { new: true }
    );
    return updatedCategory;
  } else {
    const newCategory = await Category.create<CategoryData>(category);
    return newCategory;
  }
}

export async function POST(req: Request) {
  try {
    // Verify admin permission
    await restrictToAdmin();

    const category: ICategory = await req.json();
    const newCategory = await createUpdateCategory(category);
    return Response.json(newCategory, { status: 201 });
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

export async function PATCH(req: Request) {
  try {
    // Verify admin permission
    await restrictToAdmin();

    const category: ReqCategory = await req.json();
    const updatedCategory = await createUpdateCategory(category);

    return Response.json(updatedCategory, { status: 200 });
  } catch (error: any) {
    console.log(error.message || error.errMsg);
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while updating the category."
      },
      { status: 500 }
    );
  }
}
