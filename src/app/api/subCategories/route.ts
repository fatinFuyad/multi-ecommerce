import { dbConnect } from "@/lib/dbConnect";
import SubCategory, {
  ISubCategory,
  SubCategoryData
} from "@/models/SubCategory";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export interface ReqSubCategory extends ISubCategory {
  _id?: mongoose.Types.ObjectId;
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

// Function: Creates or updates a subCategory into the database
// Permission Level: Admin only
// Parameters:
//   - subCategory: SubCategory object containing details of the subCategory to be upserted.
// Returns: Updated or newly created subCategory details.

export async function createUpdateSubCategory(
  subCategory: ReqSubCategory
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
      subCategory,
      { new: true }
    );
  } else {
    subCategoryData = await SubCategory.create<SubCategoryData>(subCategory);
  }
  return subCategoryData;
}

// Create subCategory route handler
export async function POST(req: Request) {
  try {
    // Verify admin permission
    await restrictToAdmin();

    await dbConnect();
    const subCategory: ISubCategory = await req.json();
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
export async function GET() {
  try {
    await dbConnect();
    const subCategories = await SubCategory.find()
      .sort({ updatedAt: -1 })
      .populate({
        path: "category"
        // select: "name url"
      });

    // console.log("subCategories route");
    return Response.json({ subCategories, success: true }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    );
  }
}
