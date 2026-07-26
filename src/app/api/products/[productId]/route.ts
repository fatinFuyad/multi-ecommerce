import Product, { IProduct } from "@/models/Product";

import { restrictTo } from "@/lib/apiUtils";
import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { Types } from "mongoose";

interface RouteParams {
  params: {
    productId: Types.ObjectId;
  };
}

/**
 * @description Retrieves a specific product from the database.
 * @access Level: Public
 * @param productId: The ID of the product to be retrieved.
 * @returns requested product.
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    await dbConnect();

    const query = new QueryBuilder(Product.findOne({ _id: params.productId }), req.url)
      .limitFields()
      .handleQueryOptions(req.headers)
      .build();

    // const product = await handleQueryOptions(req, query);
    const product = await query;
    return Response.json({ product, success: true }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { success: false, product: null, message: error.message },
      { status: 404 }
    );
  }
}

/**
 * @description Updates a product in the database.
 * @access Permission Level: SELLER only
 * @param productId - The ID of the product to be deleted.
 * @returns Response with the updated product
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    // Verify Seller permission
    await restrictTo("SELLER");
    await dbConnect();

    const product: IProduct = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(params.productId, {
      ...product
    } satisfies Partial<IProduct>);

    return Response.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.log(error.message || error.errMsg);
    return Response.json(
      {
        success: false,
        message: error.message || "An internal error occured while updating the product."
      },
      { status: 500 }
    );
  }
}

/**
 * @description Deletes a product from the database.
 * @access Permission Level: SELLER only
 * @param productId - The ID of the product to be deleted.
 * @returns Response indicating success or failure of the deletion operation.
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Verify Seller permission
    await restrictTo("SELLER");
    await dbConnect();

    await Product.findByIdAndDelete(params.productId);
    return Response.json(
      { success: true, message: "Product has been successfully deleted." },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "An internal error occured while deleting the product."
      },
      { status: 500 }
    );
  }
}
