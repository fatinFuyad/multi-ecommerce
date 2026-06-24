import { dbConnect } from "@/lib/dbConnect";
import { SubCategoryFormSchemaType } from "@/lib/schemas";
import { ApiResponse, SubCategoryWithCateogry } from "@/lib/types";
import { ICategory } from "@/models/Category";
import SubCategory, { SubCategoryData } from "@/models/SubCategory";
import mongoose from "mongoose";
import { restrictTo } from "../apiUtils";

// Function: Creates or updates a subCategory into the database
// Permission Level: Admin only
// Parameters:
//   - subCategory: SubCategory object containing details of the subCategory to be upserted.
// Returns: Updated or newly created subCategory details.

export async function createUpdateSubCategory(
  subCategory: SubCategoryFormSchemaType & { _id?: mongoose.Types.ObjectId }
): Promise<SubCategoryData | null> {
  if (!subCategory) throw new Error("SubCategory data can't be empty");
  const isUpdateSession = Boolean(subCategory._id);

  // check whether subCategory with same name or URL already exists
  let existingSubCategory: SubCategoryData | null;
  if (isUpdateSession) {
    existingSubCategory = await SubCategory.findOne({
      $or: [{ name: subCategory.name }, { url: subCategory.url }],
      $nor: [{ _id: subCategory._id }]
    });
  } else {
    existingSubCategory = await SubCategory.findOne({
      $or: [{ name: subCategory.name }, { url: subCategory.url }]
    });
  }

  // Throw error if subCategory with same name or URL already exists
  if (existingSubCategory) {
    let errorMessage = "";
    if (existingSubCategory.name === subCategory.name) {
      errorMessage = "A subCategory with the same name already exists";
    } else if (existingSubCategory.url === subCategory.url) {
      errorMessage = "A subCategory with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  let subCategoryData;
  if (isUpdateSession) {
    subCategoryData = await SubCategory.findByIdAndUpdate<SubCategoryData>(
      subCategory._id,
      {
        ...subCategory,
        image: subCategory.image.at(0)?.url as string
      } satisfies ICategory,
      { new: true }
    );
  } else {
    subCategoryData = await SubCategory.create<SubCategoryData>({
      ...subCategory,
      image: subCategory.image.at(0)?.url as string
    } satisfies ICategory);
  }
  return subCategoryData;
}

// Create subCategory route handler
export async function POST(req: Request) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    const subCategory: SubCategoryFormSchemaType = await req.json();
    const newSubCategory = await createUpdateSubCategory(subCategory);
    return Response.json(
      { subCategory: newSubCategory, success: true },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "An internal error occured while creating new subCategory."
      },
      { status: 500 }
    );
  }
}

// Function: Retrieves all subCategories from the database.
// Permission Level: Public
// Returns: Array of subCategories sorted by updatedAt date in descending order.
export async function GET(req: Request) {
  try {
    await dbConnect();

    const query = SubCategory.find().sort({ updatedAt: -1 });

    // from the client a custom header is sent to modify the query for population
    if (req.headers.get("populate") === "category") {
      query.populate({
        path: "category"
        // select: "name url"
      });
    }

    const subCategories = await query;

    // console.log("subCategories route");
    return Response.json(
      { subCategories, success: true, status: 200 } satisfies ApiResponse<{
        subCategories: (SubCategoryData | SubCategoryWithCateogry)[];
      }>,
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        subCategories: [],
        success: false,
        message: error.message,
        status: 500
      } satisfies ApiResponse<{ subCategories: [] }>,
      { status: 500 }
    );
  }
}
