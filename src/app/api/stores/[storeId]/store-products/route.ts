import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import Product from "@/models/Product";

/**
 * @description Get all products data in detail with variants, subcategory, category and store data included from the database.
 * @access Level: SELLER
 * @returns products with popuplated fields
 */
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    await dbConnect();

    const query = new QueryBuilder(Product.findOne({ store: params.storeId }), req.url)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .handleQueryOptions(req.headers)
      .build();

    const products = await query;

    return Response.json(
      {
        total: products.length,
        success: true,
        message: "Get all products successfully",
        status: 200,
        fields: req.headers.get("fields"),
        products
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 404 });
  }
}
