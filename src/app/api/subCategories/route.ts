import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { SubcategoryFormSchemaType } from "@/lib/schemas";
import Subcategory, { ISubcategory, SubcategoryDoc } from "@/models/Subcategory";
import { Types } from "mongoose";
import { restrictTo } from "../apiUtils";
import { ApiResponse, SubcategoryWithCateogry } from "@/lib/types";

/**
 * @description: Creates or updates a subcategory into the database
 * @protected Level: Admin only
 * @param: subcategory: Subcategory object containing details of the subcategory to be upserted.
 * @returns: Updated or newly created subcategory details.
 */
export async function createUpdateSubcategory(
  subcategory: SubcategoryFormSchemaType & { _id?: Types.ObjectId }
): Promise<SubcategoryDoc | null> {
  if (!subcategory) throw new Error("Subcategory data can't be empty");
  const isUpdateSession = Boolean(subcategory._id);

  // check whether subcategory with same name or URL already exists
  let existingSubcategory: SubcategoryDoc | null;
  if (isUpdateSession) {
    existingSubcategory = await Subcategory.findOne({
      $or: [{ name: subcategory.name }, { url: subcategory.url }],
      $nor: [{ _id: subcategory._id }]
    });
  } else {
    existingSubcategory = await Subcategory.findOne({
      $or: [{ name: subcategory.name }, { url: subcategory.url }]
    });
  }

  // Throw error if subcategory with same name or URL already exists
  if (existingSubcategory) {
    let errorMessage = "";
    if (existingSubcategory.name === subcategory.name) {
      errorMessage = "A subcategory with the same name already exists";
    } else if (existingSubcategory.url === subcategory.url) {
      errorMessage = "A subcategory with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  let subcategoryData;
  if (isUpdateSession) {
    subcategoryData = await Subcategory.findByIdAndUpdate<SubcategoryDoc>(
      subcategory._id,
      {
        ...subcategory,
        image: subcategory.image[0].url,
        category: new Types.ObjectId(subcategory.category)
      } satisfies Partial<ISubcategory>, // updates do not require all schema fields
      { new: true }
    );
  } else {
    subcategoryData = await Subcategory.create<SubcategoryDoc>({
      ...subcategory,
      image: subcategory.image[0].url,
      category: new Types.ObjectId(subcategory.category)
    } satisfies Omit<ISubcategory, "_id" | "createdAt" | "updatedAt">);
  }
  return subcategoryData;
}

// Create subcategory route handler
export async function POST(req: Request) {
  try {
    // Verify admin permission
    await restrictTo("ADMIN");

    await dbConnect();
    const subcategory: SubcategoryFormSchemaType = await req.json();
    const newSubcategory = await createUpdateSubcategory(subcategory);
    return Response.json({ subcategory: newSubcategory, success: true }, { status: 201 });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message:
          error.message || "An internal error occured while creating new subcategory."
      },
      { status: 500 }
    );
  }
}

/**
 * @description: Retrieves all subcategories from the database.
 * @protected Level: Public
 * @returns: Array of subcategories sorted by updatedAt date in descending order.
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    console.log("subcategories route --->", req.url);
    const query = new QueryBuilder(Subcategory.find(), req.url);
    const dbQuery = query.filter().limitFields().paginate().build();

    if (req.headers.has("populate")) {
      dbQuery.populate(req.headers.get("populate")!);
    }
    if (req.headers.has("lean")) {
      dbQuery.lean();
    }

    const subcategories = await dbQuery;

    return Response.json({
      status: 200,
      success: true,
      message: "Get all subcategories with specified query was successful",
      subcategories
    } as ApiResponse<{ subcategories: (SubcategoryDoc | SubcategoryWithCateogry)[] }>);
  } catch (error: any) {
    console.log(error.message);
    return Response.json({ success: false, status: 500, message: "Api response Error" });
  }
}
