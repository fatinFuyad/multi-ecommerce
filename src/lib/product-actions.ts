"use server";

import { restrictTo } from "@/app/api/apiUtils";
import Product, { IProduct, IProductVariant, ProductVariant } from "@/models/Product";
import Store from "@/models/Store";
import { Types } from "mongoose";
import { dbConnect } from "./db-connect";
import { ProductFormSchemaType } from "./schemas";

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
export async function upsertProduct(
  productData: ProductFormSchemaType & { productId?: Types.ObjectId },
  storeUrl: string
) {
  await dbConnect();
  await restrictTo("SELLER");

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
    console.log({ storeUrl });
    const store = await Store.findOne({ url: storeUrl }).select("_id");
    console.log(store);
    storeId = store._id;
    productId = new Types.ObjectId();
  }

  const commonProductData = {
    name: productData.name,
    description: productData.description,
    slug: productSlug,
    brand: productData.brand,
    rating: 0,
    store: storeId as Types.ObjectId,
    variants: [variantId], // Types.ObjectId[],
    category: new Types.ObjectId(productData.category),
    subcategory: new Types.ObjectId(productData.subcategory),
    _id: productId,
    createdAt: new Date(),
    updatedAt: new Date()
  } satisfies IProduct;

  const commonVariantData = {
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
    product: productId,
    _id: variantId,
    createdAt: new Date(),
    updatedAt: new Date()
  } satisfies IProductVariant;

  if (!existingProduct) {
    // Create both the product and the variant
    const newProduct = await Product.create(commonProductData satisfies IProduct);
    const newVariant = await ProductVariant.create(
      commonVariantData satisfies IProductVariant
    );
    return { product: newProduct, variant: newVariant };
  } else {
    // Create only the variant and reference to product
    await ProductVariant.create(commonVariantData satisfies IProductVariant);

    // Update the product's variant reference array
    await Product.findByIdAndUpdate(productData.productId, {
      $push: {
        variants: variantId
      }
    });
  }
}

export async function upsertProductForm(formData: FormData, ...rest: any[]) {
  console.log(formData);
  console.log(rest);
  return { author: "developer" };
}
