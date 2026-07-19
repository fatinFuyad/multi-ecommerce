import { dbConnect } from "@/lib/dbConnect";
import { SubcategoryFormSchemaType } from "@/lib/schemas";
import Subcategory, { ISubcategory, SubcategoryDoc } from "@/models/Subcategory";
import { Types } from "mongoose";
import { restrictTo } from "../apiUtils";
import { QueryBuilder } from "@/lib/query-builder";

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
// export async function GET(req: Request) {
//   try {
//     await dbConnect();

//     const query = Subcategory.find().sort({ updatedAt: -1 });

//     // from the client a custom header is sent to modify the query for population
//     if (req.headers.get("populate") === "category") {
//       query.populate({
//         path: "category"
//         // select: "name url"
//       });
//     }

//     const subcategories = await query;

//     // console.log("subcategories route");
//     return Response.json(
//       { subcategories, success: true, status: 200 } satisfies ApiResponse<{
//         subcategories: (SubcategoryDoc | SubcategoryWithCateogry)[];
//       }>,
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return Response.json(
//       {
//         subcategories: [],
//         success: false,
//         message: error.message,
//         status: 500
//       } satisfies ApiResponse<{ subcategories: [] }>,
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: Request) {
  try {
    await dbConnect();

    const query = new QueryBuilder(Subcategory.find(), req.url);
    const dbQuery = query.filter().limitFields().paginate().build();

    console.log(req.headers.get("populate"));
    if (req.headers.has("populate")) {
      dbQuery.populate(req.headers.get("populate")!);
    }
    if (req.headers.has("lean")) {
      dbQuery.lean();
    }

    const subcategories = await dbQuery;

    return Response.json({
      status: 200,
      message: "Api response was successfull",
      subcategories
    });
  } catch (error: any) {
    console.log(error.message);
    return Response.json({ status: 500, message: "Api response Error" });
  }
}
