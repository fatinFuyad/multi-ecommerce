import { dbConnect } from "@/lib/dbConnect";
import Subcategory from "@/models/Subcategory";
import mongoose from "mongoose";
import { restrictTo } from "../../apiUtils";
import { SubcategoryFormSchemaType } from "@/lib/schemas";
import { createUpdateSubcategory } from "../route";

interface RouteParams {
  params: {
    subCategoryId: mongoose.Types.ObjectId;
  };
}

// Function: Retrieves a specific subcategory from the database.
// Access Level: Public
// Parameters:
//   - subCategoryId: The ID of the subcategory to be retrieved.
// Returns: Details of the requested subcategory.
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const subcategory = await Subcategory.findById(params.subCategoryId);
    return Response.json({ subcategory, success: true }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 404 }
    );
  }
}

// Update subcategory route handler
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    const subcategory: SubcategoryFormSchemaType = await req.json();

    const updatedSubcategory = await createUpdateSubcategory({
      ...subcategory,
      _id: params.subCategoryId
    });

    return Response.json(
      { subcategory: updatedSubcategory, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while updating the subcategory."
      },
      { status: 500 }
    );
  }
}

// Function: Deletes a subcategory from the database.
// Permission Level: Admin only
// Parameters:
//   - subCategoryId: The ID of the subcategory to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    await Subcategory.findByIdAndDelete(params.subCategoryId);
    return Response.json(
      { success: true, message: "Subcategory has been successfully deleted." }
      // { status: 204 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while deleting the subcategory."
      },
      { status: 500 }
    );
  }
}
