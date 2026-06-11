import { dbConnect } from "@/lib/dbConnect";
import SubCategory from "@/models/SubCategory";
import mongoose from "mongoose";
import {
  ReqSubCategory,
  createUpdateSubCategory,
  restrictToAdmin
} from "../route";

interface RouteParams {
  params: {
    subCategoryId: mongoose.Types.ObjectId;
  };
}

// Function: Retrieves a specific subCategory from the database.
// Access Level: Public
// Parameters:
//   - subCategoryId: The ID of the subCategory to be retrieved.
// Returns: Details of the requested subCategory.
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const subCategory = await SubCategory.findById(params.subCategoryId);
    return Response.json({ subCategory, success: true }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 404 }
    );
  }
}

// Update subCategory route handler
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    // Verify admin permission
    await restrictToAdmin();

    await dbConnect();
    const subCategory: ReqSubCategory = await req.json();
    subCategory._id = params.subCategoryId;
    const updatedSubCategory = await createUpdateSubCategory(subCategory);

    return Response.json(
      { subCategory: updatedSubCategory, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while updating the subCategory."
      },
      { status: 500 }
    );
  }
}

// Function: Deletes a subCategory from the database.
// Permission Level: Admin only
// Parameters:
//   - subCategoryId: The ID of the subCategory to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Verify admin permission
    await restrictToAdmin();

    await dbConnect();
    await SubCategory.findByIdAndDelete(params.subCategoryId);
    return Response.json(
      { success: true, message: "SubCategory has been successfully deleted." }
      // { status: 204 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while deleting the subCategory."
      },
      { status: 500 }
    );
  }
}
