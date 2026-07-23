"use server";

import { restrictTo } from "@/app/api/apiUtils";
import { dbConnect } from "@/lib/db-connect";
import { ProductFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import { Store } from "@/models";
import Product, {
  IProduct,
  IProductVariant,
  ProductDoc,
  ProductVariant,
  ProductVariantDoc
} from "@/models/Product";
import { Types } from "mongoose";

function generateSlug(
  value: string,
  options?: {
    lowerCase?: boolean;
    upperCase?: boolean;
    trim?: boolean;
    separator?: string;
  }
): string {
  const {
    lowerCase = true,
    upperCase = false,
    trim = true,
    separator = "_"
  } = options || {};
  let modified = value;
  if (trim) modified = value.trim();
  if (lowerCase) modified = value.toLowerCase();
  if (upperCase) modified = value.toUpperCase();
  if (separator) modified = value.replaceAll(" ", separator);

  return modified;
}

/*
function slugify(value, options){
    const {trim = true, lower = true, upper=false , separator ='-' } = options || {};
    let modified = trim ? value.trim(): value;
        modified = lower? modified.toLowerCase(): upper? modified.toUpperCase(): modified;
        modified = modified.replace(/\s+/g, separator);
        modified = modified.replace(/\W+/g, separator);
        modified = modified.replace(new RegExp(`\\${separator}{2,}`, 'g', separator)); // /\-{2,}/g
    return modified;
};
'!!!fuyad-gmail-com-max!!!!'.replace(/(^\W+)|(\W+$)/g, '') // ==> 'fuyad-gmail-com-max'
 */

// james_cotton_shirt_260721
// james_cotton_shirt_6a5f46cdd30732e9b1dc3729

/**
 * @name upsertProduct
 * @description Upserts a product and its variant into the database, ensuring proper association with the store.
 * @access Access Level: Seller Only
 * @param productData ProductWithVariant object containing details of the product and its variant.
 * @param storeUrl The `_id` of store to which the product belongs.
 * @returns Newly created or updated product with variant details `populated`
 */
export async function POST(req: Request, res: Response) {
  try {
    await dbConnect();
    await restrictTo("SELLER");

    const productData: ProductFormSchemaType & {
      productId?: Types.ObjectId;
      storeUrl: string;
    } = await req.json();
    const storeUrl: string = productData.storeUrl;

    const productSlug = productData.name.toLowerCase().trim().replaceAll(" ", "_");
    const variantSlug = productData.variantName.toLowerCase().trim().replaceAll(" ", "_");

    // check if product already exists in database. then create a new variant for that product
    let existingProduct;
    if (productData.productId) {
      existingProduct = await Product.findById(productData.productId);
    }

    // Generating _id before store in database for early reference
    const variantId = new Types.ObjectId();
    let productId = productData.productId as Types.ObjectId;
    let storeId: Types.ObjectId | undefined;

    if (!existingProduct) {
      const store = await Store.findOne({ url: storeUrl }).select("_id");
      storeId = store._id;
      productId = new Types.ObjectId();
    }

    const commonProductData = {
      _id: productId,
      name: productData.name,
      description: productData.description,
      slug: productSlug,
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
