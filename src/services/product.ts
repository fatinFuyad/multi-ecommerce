"use server";

import { dbConnect } from "@/lib/db-connect";
import { PopulateQueryOptions, QueryBuilder, QueryParams } from "@/lib/query-builder";
import {
  ProductCardType,
  ProductDetailedDocType,
  ProductPageData,
  UserCountry
} from "@/lib/types";

import Product, {
  IProduct,
  ProductSchema,
  ProductVariant,
  ProductVariantSchema
} from "@/models/Product";

import { ProductFormSchemaType } from "@/lib/schemas";
import {
  Country,
  FreeShipping,
  FreeShippingSchema,
  FreeShippingWithCountries,
  ShippingRate,
  ShippingRateSchema
} from "@/models/Shipping-Rate";
import { StoreSchema } from "@/models/Store";
import { getCookie } from "cookies-next";
import { HydratedDocument, isValidObjectId, Types } from "mongoose";
import { cookies } from "next/headers";

import { restrictTo } from "@/lib/api-utils";
import { ProductRawSchema, ProductVariantRawSchema } from "@/models/Product";
import Store from "@/models/Store";
import { getReviews, getReviewStatistics } from "./review";

// Top level await for once per module evaluation/runtime instance
// await dbConnect();

/**
 * @description Generates a slug based on the provided string.
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
      const existingSlug = await Model.exists({ [field]: slugStr });
      if (!existingSlug) break;
      // using 4 digit random value between 1000 to 9999
      slugStr = slugStr + separator + Math.trunc(Math.random() * 9000 + 1000);
    }
  }

  // examples:
  // james_cotton_shirt_2607 <-- random 4-digit
  // james_cotton_shirt_6a5f46cdd30732e9b1dc3729 <-- _id joined

  return slugStr;
}

/**
 * @function upsertProduct
 * @description Upserts a product and its variant into the database, ensuring proper association with the store.
 * @access Level: Seller Only
 * @param
 *   - product - ProductWithVariant object containing details of the product and its variant.
 *   - storeUrl - The URL of the store to which the product belongs.
 * @returns Newly created or updated product with variant details.
 */
export const upsertProduct = async (
  productFormData: ProductFormSchemaType,
  storeUrl: string
) => {
  await dbConnect(); // connect database
  // Check if user is authenticated & Ensure user has seller privileges
  const user = await restrictTo("SELLER");

  // Ensure product data is provided
  if (!productFormData) throw new Error("Please provide product data.");

  // Find the store by URL
  const store = await Store.exists({
    url: storeUrl,
    user: user._id
  });
  if (!store) throw new Error("No store found for the seller!");

  // Check if the product already exists
  const isExistingProduct =
    isValidObjectId(productFormData.productId) &&
    (await Product.exists({ _id: productFormData.productId }));

  // Check if the variant already exists
  const isExistingVariant =
    isValidObjectId(productFormData.variantId) &&
    (await ProductVariant.exists({ _id: productFormData.variantId }));

  if (isExistingProduct) {
    if (isExistingVariant) {
      // Update the existing product & variant
      await handleUpsertVariant(productFormData, { isUpdating: true });
      await handleUpsertProduct(productFormData, {
        storeId: store._id,
        isUpdating: true
      });
    } else {
      // Create new variant
      await handleUpsertVariant(productFormData, {
        productId: new Types.ObjectId(productFormData.productId!)
      });
    }
  }

  // Create a new product and variant
  if (!isExistingProduct) {
    const newProduct = await handleUpsertProduct(productFormData, { storeId: store._id });
    await handleUpsertVariant(productFormData, {
      productId: newProduct._id,
      isUpdating: false
    });
  }

  // ts-expect-error overriding the _id ref with variant doc
  // if (newProduct) newProduct.variants = [newVariant];
  // const productWithVariant = JSON.parse(JSON.stringify(newProduct)) as ProductWithVariant;
  return;
};

const handleUpsertProduct = async (
  product: ProductFormSchemaType,
  options: {
    storeId: Types.ObjectId;
    isUpdating?: boolean;
  }
) => {
  const { isUpdating = false, storeId } = options;
  // Generate unique slugs for product and variant
  const productSlug = isUpdating
    ? product.productSlug
    : await generateSlug(product.name, ProductVariant, {
        unique: true
      });

  const productId = product.productId
    ? new Types.ObjectId(product.productId)
    : new Types.ObjectId();

  let productData: Partial<ProductRawSchema> = {
    name: product.name,
    description: product.description,
    category: new Types.ObjectId(product.category),
    subcategory: new Types.ObjectId(product.subcategory),
    offerTag: new Types.ObjectId(product.offerTagId),
    brand: product.brand,
    specifications: product.productSpecs as Types.DocumentArray<{
      name: string;
      value: string;
    }>,
    questions: product.questions as Types.DocumentArray<{
      question: string;
      answer: string;
    }>,

    shippingFeeMethod: product.shippingFeeMethod,
    freeShippingForAllCountries: product.freeShippingForAllCountries
  };

  // create freeShipping doc if there's freeShipping country ids
  if (!product.freeShippingForAllCountries) {
    if (product.freeShippingCountriesIds) {
      const freeShippingData = {
        product: productId,
        eligibleCountries: product.freeShippingCountriesIds.map(
          (shippingCountry) => new Types.ObjectId(shippingCountry.value)
        )
      } satisfies Pick<FreeShippingSchema, "product" | "eligibleCountries">;
      const newShipping = await FreeShipping.findOneAndUpdate(
        { product: productId },
        freeShippingData,
        { upsert: true, new: true }
      );

      // update the product's freeShipping reference
      if (newShipping) productData.freeShipping = newShipping._id;
    }
  }

  if (!isUpdating) {
    productData = { ...productData, slug: productSlug, variants: [], store: storeId };
  }

  let newProduct;

  if (isUpdating) {
    newProduct = await Product.findByIdAndUpdate(productId, productData, {
      new: true,
      lean: true
    });
  } else {
    newProduct = await Product.create(productData);
  }
  return newProduct as ProductSchema;
};

const handleUpsertVariant = async (
  product: ProductFormSchemaType,
  options: { isUpdating?: false; productId: Types.ObjectId } | { isUpdating: true }
) => {
  const variantSlug =
    options.isUpdating && product.variantSlug
      ? product.variantSlug
      : await generateSlug(product.variantName, ProductVariant, {
          unique: true
        });

  const variantId = options.isUpdating
    ? new Types.ObjectId(product.variantId)
    : new Types.ObjectId();

  const variantData = {
    _id: variantId,
    variantName: product.variantName,
    slug: variantSlug,
    product: options.isUpdating
      ? new Types.ObjectId(product.productId)
      : options.productId,
    variantDescription: product.variantDescription,
    variantImage: product.variantImage[0].url,
    sku: product.sku,
    weight: product.weight,
    keywords: product.keywords.join(","),
    isSale: product.isSale,
    saleEndDate: product.saleEndDate,
    images: product.images as Types.DocumentArray<any>,
    colors: product.colors as Types.DocumentArray<any>,
    sizes: product.sizes as Types.DocumentArray<any>,
    specifications: product.variantSpecs as Types.DocumentArray<any>
  } satisfies ProductVariantRawSchema;

  let newVariant;
  if (options.isUpdating) {
    newVariant = await ProductVariant.findByIdAndUpdate(variantId, variantData, {
      new: true,
      lean: true
    });
  } else {
    newVariant = await ProductVariant.create(variantData);
    // updating the variants ref array of Product
    await Product.findByIdAndUpdate(
      options.productId,
      {
        $push: { variants: newVariant._id }
      },
      { lean: true, new: true }
    );
  }

  return newVariant as ProductVariantSchema;
};

/**
 * @description Get all products from the database.
 * @access Level: Public
 * @returns requested products.
 */
export async function getAllProducts<T = IProduct>(
  queryItem?: QueryParams,
  queryOptions?: PopulateQueryOptions
) {
  await dbConnect(); // connect database
  const query = new QueryBuilder(Product.find().lean(), queryItem || {})
    .filter()
    .sort()
    .limitFields()
    .populateDoc(queryOptions)
    .paginate()
    .exec<{ products: T[] }>(Product);

  const productsData = await query;

  return JSON.parse(JSON.stringify(productsData)) as typeof productsData;
}

/**
 * @description Get products with necessary query and search options - filter, sort, limit fields, paginate
 * @returns productWithVariants[]
 */
export async function getProducts<T = IProduct>(
  queryItem: QueryParams,
  queryOptions?: PopulateQueryOptions
) {
  await dbConnect(); // connect database
  const query = new QueryBuilder(Product.find().lean(), queryItem)
    .filter()
    .limitFields()
    .paginate()
    .populateDoc(queryOptions)
    .build();
  const productDocs = await query;

  const products: T[] = JSON.parse(JSON.stringify(productDocs));
  return products;
}

export async function getProductById<T = IProduct>(
  productId: string,
  queryOptions?: PopulateQueryOptions
) {
  await dbConnect(); // connect database
  const query = new QueryBuilder(Product.find({ _id: productId }).lean(), {})
    .limitFields()
    .populateDoc(queryOptions)
    .build();

  const [product] = await query; // QueryBuilder return product in an array

  if (!product) throw new Error("No product found with the product ID");
  return JSON.parse(JSON.stringify(product)) as T;
}

export async function getProduct<T = IProduct>(
  queryItem: QueryParams = {},
  queryOptions?: PopulateQueryOptions
) {
  await dbConnect(); // connect database
  const query = new QueryBuilder(Product.find().lean(), queryItem)
    .filter()
    .limitFields()
    .populateDoc(queryOptions)
    .build();

  const [product] = await query;
  if (!product) throw new Error("No product found with the query");

  return JSON.parse(JSON.stringify(product)) as T;
}

export async function getCardProducts(
  queryItem: QueryParams = {},
  queryOptions?: PopulateQueryOptions
) {
  await dbConnect(); // connect database

  const findQuery = Product.find()
    .select("_id slug name averageRating sales")
    .populate({
      path: "variants",
      select: "_id slug variantName images sizes variantImage"
    })
    .lean();

  const query = new QueryBuilder(findQuery, queryItem)
    .filter()
    .limitFields()
    .paginate()
    .populateDoc(queryOptions)
    .build();
  const productDocs = await query;

  const products: ProductCardType[] = JSON.parse(JSON.stringify(productDocs));
  return products;
}

export async function deleteProduct(productId: string) {
  if (!productId) throw new Error("Product ID is required");
  await dbConnect(); // connect database
  await Product.findByIdAndDelete(productId);

  return null;
}

/**
 * @description Get products data for product-page from the database.
 * @access Level: Public
 * @returns requested productPageData.
 */
export async function getProductPageData(productSlug: string, variantSlug: string) {
  await dbConnect(); // connect database

  const product = await Product.findOne({
    slug: productSlug
  })
    .populate({
      path: "category"
    })
    .populate({ path: "subcategory" })
    .populate({ path: "store" })
    .populate({ path: "offerTag" })
    .lean<ProductDetailedDocType>();

  if (!product) throw new Error("No product found with product slug");

  const variants = await ProductVariant.find({
    product: product._id
  }).lean<ProductVariantSchema[]>();

  const activeVariant = variants.find((variant: any) => variant.slug === variantSlug);
  if (activeVariant) product.variants = [activeVariant];

  const userCountry = getUserCountry();
  let freeShipping;
  if (product.freeShipping) {
    freeShipping = await FreeShipping.findOne<
      HydratedDocument<FreeShippingWithCountries>
    >({ _id: product.freeShipping }).populate({
      path: "eligibleCountries"
    });
  }

  // Calculate and retrieve the shipping details
  const shippingDetails = await getShippingDetails(
    product.shippingFeeMethod,
    userCountry,
    product.store,
    freeShipping
  );

  // Reviews Statistics
  const reviewStatistics = await getReviewStatistics(product._id.toString());
  const reviews = await getReviews(product._id.toString());

  return JSON.parse(
    JSON.stringify({
      product,
      variants,
      userCountry,
      shippingDetails,
      freeShipping,
      reviews,
      reviewStatistics
    })
  ) as ProductPageData;
}

function getUserCountry(): UserCountry {
  let userCountry: UserCountry = {
    name: "Bangladesh",
    code: "BD",
    city: "Dhaka",
    region: "Dhaka Division"
  };

  // Get the user's country cookie. if missing set default country
  const userCountryCookie =
    getCookie("userCountry", { cookies }) || JSON.stringify(userCountry);

  try {
    const parsedCountry = JSON.parse(userCountryCookie); // ⚠️ errors if not valid json
    if (
      parsedCountry &&
      typeof parsedCountry === "object" &&
      "name" in parsedCountry &&
      "code" in parsedCountry
    ) {
      userCountry = parsedCountry;
    }
  } catch (error: any) {
    console.error("Failed to parse userCountryCookie", error.message);
  } finally {
    return userCountry;
  }
}
/**
 * @description Retrieves and calculates shipping details based on user country and product.
 * @access Level: Public
 * @param
 * - shippingFeeMethod: The shipping fee method of the product.
 * - userCountry: The parsed user country object from cookies.
 * - store:  store details.
 * @returns Calculated shipping details.
 */
export const getShippingDetails = async (
  shippingFeeMethod: string,
  userCountry: UserCountry,
  store: StoreSchema,
  freeShipping?: FreeShippingWithCountries | null
) => {
  await dbConnect(); // connect database
  let shippingDetails = {
    shippingFeeMethod,
    shippingService: "",
    shippingFee: 0,
    extraShippingFee: 0,
    deliveryTimeMin: 0,
    deliveryTimeMax: 0,
    returnPolicy: "",
    countryCode: userCountry.code,
    countryName: userCountry.name,
    city: userCountry.city,
    isFreeShipping: false
  };

  const country = await Country.findOne({
    name: userCountry.name
  });

  if (!country) return null;

  // Retrieve shipping rate for the country
  const shippingRate: ShippingRateSchema | null = await ShippingRate.findOne({
    country: country._id,
    store: store._id
  });

  const returnPolicy = shippingRate ? shippingRate.returnPolicy : store.returnPolicy;
  const shippingService = shippingRate
    ? shippingRate.shippingService
    : store.defaultShippingService;
  const shippingFeePerItem = shippingRate
    ? shippingRate.shippingFeePerItem
    : store.defaultShippingFeePerItem;
  const shippingFeeForAdditionalItem = shippingRate
    ? shippingRate.shippingFeeForAdditionalItem
    : store.defaultShippingFeeForAdditionalItem;
  const shippingFeePerKg = shippingRate
    ? shippingRate.shippingFeePerKg
    : store.defaultShippingFeePerKg;
  const shippingFeeFixed = shippingRate
    ? shippingRate.shippingFeeFixed
    : store.defaultShippingFeeFixed;
  const deliveryTimeMin = shippingRate
    ? shippingRate.deliveryTimeMin
    : store.defaultDeliveryTimeMin;
  const deliveryTimeMax = shippingRate
    ? shippingRate.deliveryTimeMax
    : store.defaultDeliveryTimeMax;

  // Check for free shipping
  if (freeShipping) {
    const free_shipping_countries = freeShipping.eligibleCountries;
    const check_free_shipping = free_shipping_countries.find(
      (c) => c.country === country._id
    );
    if (check_free_shipping) {
      shippingDetails.isFreeShipping = true;
    }
  }

  shippingDetails = {
    shippingFeeMethod,
    shippingService: shippingService,
    shippingFee: 0,
    extraShippingFee: 0,
    deliveryTimeMin,
    deliveryTimeMax,
    returnPolicy,
    countryCode: userCountry.code,
    countryName: userCountry.name,
    city: userCountry.city,
    isFreeShipping: shippingDetails.isFreeShipping
  };

  const { isFreeShipping } = shippingDetails;
  switch (shippingFeeMethod) {
    case "ITEM":
      shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeePerItem;
      shippingDetails.extraShippingFee = isFreeShipping
        ? 0
        : shippingFeeForAdditionalItem;
      break;

    case "WEIGHT":
      shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeePerKg;
      break;

    case "FIXED":
      shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeeFixed;
      break;

    default:
      break;
  }

  return shippingDetails;
};
