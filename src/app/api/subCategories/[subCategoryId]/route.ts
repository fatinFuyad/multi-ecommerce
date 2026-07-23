import { dbConnect } from "@/lib/db-connect";
import Subcategory, { SubcategoryDoc } from "@/models/Subcategory";
import mongoose from "mongoose";
import { restrictTo } from "../../apiUtils";
import { SubcategoryFormSchemaType } from "@/lib/schemas";
import { createUpdateSubcategory } from "../route";
import { ApiResponse } from "@/lib/types";

interface RouteParams {
  params: {
    subcategoryId: mongoose.Types.ObjectId;
  };
}

// Function: Retrieves a specific subcategory from the database.
// Access Level: Public
// Parameters:
//   - subcategoryId: The ID of the subcategory to be retrieved.
// Returns: Details of the requested subcategory.
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const subcategory = await Subcategory.findById(params.subcategoryId);
    return Response.json(
      {
        subcategory,
        success: true,
        status: 200,
        message: "Get subcategory successfully"
      } as ApiResponse<{ subcategory: SubcategoryDoc }>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
        subcategory: null,
        status: 404
      } satisfies ApiResponse<{ subcategory: null }>,
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
      _id: params.subcategoryId
    });

    return Response.json(
      {
        subcategory: updatedSubcategory,
        success: true,
        status: 200,
        message: "Updated subcategory successfully"
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        subcategory: null,
        status: 500,
        message:
          error.message || "An internal error occured while updating the subcategory."
      },
      { status: 500 }
    );
  }
}

// Function: Deletes a subcategory from the database.
// Permission Level: Admin only
// Parameters:
//   - subcategoryId: The ID of the subcategory to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    await Subcategory.findByIdAndDelete(params.subcategoryId);
    return Response.json(
      {
        success: true,
        message: "Subcategory has been successfully deleted.",
        status: 204
      }
      // { status: 204 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        status: 500,
        message:
          error.message || "An internal error occured while deleting the subcategory."
      },
      { status: 500 }
    );
  }
}
