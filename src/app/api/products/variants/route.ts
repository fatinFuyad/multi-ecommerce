import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { ProductVariant, ProductVariantDoc } from "@/models/Product";
import { Model } from "mongoose";

/**
 * @description Get all products from the database.
 * @access Level: Public
 * @returns requested products.
 */
export async function GET(req: Request) {
  try {
    await dbConnect();

    const query = new QueryBuilder(ProductVariant.find(), req.url)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .handleQueryOptions(req.headers)
      .build();

    const variants = await query;

    return Response.json(
      {
        variants,
        success: true,
        message: "Get all product variants successfully",
        status: 200
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message, variants: [], metadata: {} },
      { status: 404 }
    );
  }
}
