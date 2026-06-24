import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import mongoose from "mongoose";
import { restrictTo } from "../../apiUtils";
import { createUpdateCategory } from "../route";
import { CategoryFormSchemaType } from "@/lib/schemas";

interface RouteParams {
  params: {
    categoryId: mongoose.Types.ObjectId;
  };
}

// Function: Retrieves a specific category from the database.
// Access Level: Public
// Parameters:
//   - categoryId: The ID of the category to be retrieved.
// Returns: Details of the requested category.
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const category = await Category.findById(params.categoryId);
    return Response.json({ category, success: true }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 404 }
    );
  }
}

// Update category route handler
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    const category: CategoryFormSchemaType = await req.json();

    const updatedCategory = await createUpdateCategory({
      ...category,
      _id: params.categoryId
    });

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

// Function: Deletes a category from the database.
// Permission Level: Admin only
// Parameters:
//   - categoryId: The ID of the category to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    await Category.findByIdAndDelete(params.categoryId);
    return Response.json(
      { success: true, message: "Category has been successfully deleted." }
      // { status: 204 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while deleting the category."
      },
      { status: 500 }
    );
  }
}
