import { dbConnect } from "@/lib/dbConnect";
import Category, { CategoryData, ICategory } from "@/models/Category";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongoose";

export interface ReqCategory extends ICategory {
  _id?: ObjectId;
}

export async function restrictToAdmin() {
  // Ensure user is authenticated
  const user = await currentUser();

  console.log(user?.privateMetadata.role + " Action");
  if (!user) throw new Error("Unauthenticated. Please sign in to continue.");

  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );
}

// Function: Creates or updates a category into the database
// Permission Level: Admin only
// Parameters:
//   - category: Category object containing details of the category to be upserted.
// Returns: Updated or newly created category details.

export async function createUpdateCategory(
  category: ReqCategory
): Promise<CategoryData | null> {
  if (!category) throw new Error("Category data can't be empty");
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

// Create category route handler
export async function POST(req: Request) {
  try {
    // Verify admin permission
    await restrictToAdmin();

    await dbConnect();
    const category: ICategory = await req.json();
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
    return Response.json({ categories, success: true }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return Response.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    );
  }
}
