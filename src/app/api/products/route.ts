import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import { ProductFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import { Types } from "mongoose";

import Product, {
  IProduct,
  IProductVariant,
  ProductDoc,
  ProductVariant,
  ProductVariantDoc
} from "@/models/Product";
import Store from "@/models/Store";

/**
 * @param value - The expected string to be slugified
 * @param Model - The mongoose model for of your schema. Used for querying to generate unique slug
 * @param options
 * @returns `slug` as a resolved Promise
 */
async function generateSlug(
  value: string,
  Model?: any, // Mongoose Model
  options?: {
    field?: string;
    upperCase?: boolean;
    separator?: string;
    unique?: boolean;
  }
): Promise<string> {
  const {
    upperCase = false,
    separator = "_",
    field = "slug",
    unique = false
  } = options || {};

  if (!value) throw new Error("Slugify requires a string value.");
  let slugStr = value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/ /g, separator);

  slugStr = !upperCase ? slugStr.toLowerCase() : slugStr.toUpperCase();
  if (unique) {
    // using time
    // slugStr = slugStr + separator + (Math.trunc(Date.now() / 100) + "").slice(3);

    while (true) {
      const existingSlug = await Model.findOne({ [field]: slugStr });
      if (!existingSlug) break;
      // using 4 digit random value between 1000 to 9999
      slugStr = slugStr + separator + Math.trunc(Math.random() * 9000 + 1000);
    }
  }

  // james_cotton_shirt_2607 <-- random 4-digit
  // james_cotton_shirt_6a5f46cdd30732e9b1dc3729 <-- _id joined

  return slugStr;
}

/**
 * @name upsertProduct
 * @description Upserts a product and its variant into the database, ensuring proper association with the store.
 * @access Access Level: Seller Only
 * @description `productData` ProductWithVariant object containing details of the product and its variant.
 *  `storeUrl` of store to which the product belongs.
 * @returns Newly created or updated product with variant
 */
export async function POST(req: Request) {
  try {
    await restrictTo("SELLER");
    await dbConnect();

    const productData: ProductFormSchemaType & {
      productId?: Types.ObjectId;
      storeUrl: string;
    } = await req.json();
    const storeUrl: string = productData.storeUrl;

    // check if product already exists in database. then create a new variant for that product
    let existingProduct;
    if (productData.productId) {
      existingProduct = await Product.findById(productData.productId);
    }

    // Generating _id before store in database for early reference
    const variantId = new Types.ObjectId();
    let productId = productData.productId as Types.ObjectId;
    let storeId: Types.ObjectId | undefined;
    let productSlug;

    const variantSlug = await generateSlug(productData.variantName, ProductVariant, {
      unique: true
    });

    if (!existingProduct) {
      const store = await Store.findOne({ url: storeUrl }).select("_id");
      storeId = store._id;
      productId = new Types.ObjectId();
      productSlug = await generateSlug(productData.name, Product, {
        unique: true
      });
    }

    const commonProductData = {
      _id: productId,
      name: productData.name,
      description: productData.description,
      slug: productSlug as string,
      brand: productData.brand,
      rating: 0,
      store: storeId as Types.ObjectId,
      variants: [variantId], // Types.ObjectId[],
      category: new Types.ObjectId(productData.category),
      subcategory: new Types.ObjectId(productData.subcategory)
    } satisfies Omit<IProduct, "createdAt" | "updatedAt">;

    const commonVariantData = {
      _id: variantId,
      variantName: productData.variantName,
      images: productData.images.map((img) => ({
        url: img.url,
        alt: img.url.split("/").pop() || ""
      })) as Types.DocumentArray<{ url: string; alt: string }>,
      variantImage: productData.variantImage[0].url,
      sku: productData.sku,
      keywords: productData.keywords.join(" "),
      colors: productData.colors as Types.DocumentArray<{
        color: string;
      }>,
      sizes: productData.sizes as Types.DocumentArray<{
        size: string;
        quantity: number;
        price: number;
        discount: number;
      }>,
      isSale: productData.isSale,
      slug: variantSlug,
      product: productId
    } satisfies Omit<IProductVariant, "createdAt" | "updatedAt">;

    let newProduct;
    let newVariant;

    if (!existingProduct) {
      // Create both the product and the variant
      newProduct = await Product.findByIdAndUpdate(productId, commonProductData, {
        upsert: true,
        new: true
      });
      newVariant = await ProductVariant.findByIdAndUpdate(variantId, commonVariantData, {
        upsert: true,
        new: true
      });
    } else {
      // Create only the variant and reference to product
      newVariant = await ProductVariant.findByIdAndUpdate(variantId, commonVariantData, {
        upsert: true,
        new: true
      });

      // Update the product's variant reference array
      newProduct = await Product.findByIdAndUpdate(
        productData.productId,
        {
          $push: {
            variants: variantId
          }
        },
        { new: true }
      );
    }

    return Response.json(
      {
        product: newProduct,
        productVariant: newVariant,
        success: true,
        message: "Upsert product and variant was successful",
        status: 201
      } satisfies ApiResponse<{ product: ProductDoc; productVariant: ProductVariantDoc }>,
      { status: 201 }
    );
  } catch (error: any) {
    console.log(error.message);
    return Response.json(
      {
        product: null,
        productVariant: null,
        success: false,
        message: error.message,
        status: 500
      } satisfies ApiResponse<{ product: null; productVariant: null }>,
      { status: 500 }
    );
  }
}

/**
 * @description Get all products from the database.
 * @access Level: Public
 * @returns requested products.
 */
export async function GET(req: Request) {
  try {
    await dbConnect();

    const query = new QueryBuilder(Product.find(), req.url)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .handleQueryOptions(req.headers)
      .build();

    // const products = await handleQueryOptions(req.headers, query);
    const products = await query;
    return Response.json(
      {
        products,
        total: products.length,
        success: true,
        message: "Get all products successfully",
        status: 200
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 404 });
  }
}
