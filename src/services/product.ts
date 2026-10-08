"use server";

import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder } from "@/lib/query-builder";
import {
  ProductCardType,
  ProductDetailedDocType,
  ProductPageData,
  ReviewStatistics,
  ReviewWithUser,
  UserCountry
} from "@/lib/types";
import { omit } from "@/lib/utils";

import Product, { ProductVariant, ProductVariantSchema } from "@/models/Product";
import Review from "@/models/Review";

import {
  Country,
  FreeShipping,
  FreeShippingWithCountries,
  ShippingRate,
  ShippingRateSchema
} from "@/models/Shipping-Rate";
import { StoreSchema } from "@/models/Store";
import { getCookie } from "cookies-next";
import { HydratedDocument, Types } from "mongoose";
import { cookies } from "next/headers";

// Top level await for once per module evaluation/runtime instance
await dbConnect();

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
  } catch (error) {
    console.error("Failed to parse userCountryCookie", (error as any).message);
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

/**
 * @description Get products with necessary query and search options - filter, sort, limit fields, paginate
 * @returns productWithVariants[]
 */
export async function getProducts(queryItem: string | Record<string, string | string[]>) {
  const productQuery = Product.find().select("_id slug name rating sales").populate({
    path: "variants",
    select: "_id slug variantName images sizes variantImage"
  });

  const query = new QueryBuilder(productQuery, queryItem).filter().paginate().build();
  const productDocs = await query;

  const products: ProductCardType[] = JSON.parse(JSON.stringify(productDocs));
  return products;
}

/**
 * @description Get products data for product-page from the database.
 * @access Level: Public
 * @returns requested productPageData.
 */
export async function getProductPageData(productSlug: string, variantSlug: string) {
  // await dbConnect();

  const product = await Product.findOne<HydratedDocument<ProductDetailedDocType>>({
    slug: productSlug
  })
    .populate({
      path: "category"
    })
    .populate({ path: "subcategory" })
    .populate({ path: "store" })
    .populate({ path: "offerTag" })
    .lean<ProductDetailedDocType>();
  // .populate({ path: "variants" });
  // .populate({path:'freeShipping'})

  if (!product) throw new Error("No product found with product slug");

  const variants = await ProductVariant.find<HydratedDocument<ProductVariantSchema>>({
    product: product._id
  });

  const activeVariant = variants.find((variant: any) => variant.slug === variantSlug);
  product.variants = [activeVariant!];

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

  /**
       product: ProductPageType, // includes variants (active), variantInfo (all)
       shippingDetails: ProductShippingDetailsType,
       storeFollwersCount: number,
       isUserFollowingStore: boolean,
       reviewStatistics: reviewStatisticsType
     */

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

export const getReviewStatistics = async (
  productId: string
): Promise<ReviewStatistics> => {
  console.log({ productId });
  const ratingStats = await Review.aggregate([
    { $match: { product: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$rating",
        reviewCount: {
          $sum: 1
        },
        reviewWithImageCount: {
          $sum: {
            $cond: [{ $gt: [{ $size: "$images" }, 0] }, 1, 0]
          }
        },
        imageCount: {
          $sum: {
            $size: "$images"
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        reviewCount: 1,
        reviewWithImageCount: 1,
        imageCount: 1,
        percentage: {
          $multiply: [{ $divide: ["$reviewWithImageCount", "$reviewCount"] }, 100]
        },
        imageReviewPercentage: {
          $multiply: [
            {
              $divide: ["$reviewWithImageCount", "$reviewCount"]
            },
            100
          ]
        }
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ]);

  // console.log("Rating Stats--> ", ratingStats);
  const totalReviews = ratingStats.reduce((sum, stat) => sum + stat.reviewCount, 0);
  const totalReviewsWithImages = ratingStats.reduce(
    (sum, stat) => sum + stat.reviewWithImageCount,
    0
  );
  const reviewWithImagesPercentage =
    totalReviews > 0 ? (totalReviewsWithImages / totalReviews) * 100 : 0;
  const ratingStatistics = ratingStats.map((stat) => ({
    rating: stat._id, // rating number
    numReviews: stat.reviewCount,
    percentage: totalReviews > 0 ? (stat.reviewCount / totalReviews) * 100 : 0
  }));

  console.log({
    ratingStatistics,
    totalReviewsWithImages,
    reviewWithImagesPercentage,
    totalReviews
  });

  return {
    ratingStatistics,
    totalReviewsWithImages,
    reviewWithImagesPercentage,
    totalReviews
  };
};

export const getReviews = async (productId: string) => {
  const query = new QueryBuilder(
    Review.find({ product: productId }).populate({
      path: "user",
      select: "_id name image"
    }),
    { limit: "4" }
  )
    .paginate()
    .build();
  const reviews = await query;

  return JSON.parse(JSON.stringify(reviews)) as ProductPageData["reviews"];
};

/**
 * @description Retrieves filtered and sorted reviews for a product from the database, based on rating, presence of images, and sorting options.
 * @access Public
 * @param productId The ID of the product for which reviews are being fetched.
 * @param queryOptions An object contains filter, sort, page, limit, fields.
 * - filter: An object containing the filter options such as rating and whether reviews include images.
 * - sort: An object defining the sort order, such as latest, oldest, or highest rating.
 * - page: The page number for pagination (1-based index).
 * - limit: The number of reviews to retrieve per page.
 * - fields: The fileds to incldue in a review.
 * @returns IReview[] A paginated list of reviews that match the filter and sort criteria.
 */

type QueryOptions = {
  filter: { rating?: number; hasImages?: boolean };
  sort?: string; // '-createdAt', '-rating'
  page?: string; // '2';
  limit?: string; // '10'
  fields?: string; // exp: 'name,price,color'
};

export const getProductFilteredReviews = async (
  productId: string,
  queryOptions: QueryOptions
) => {
  const reviewFilters: any = {};
  if (queryOptions.filter.hasImages) reviewFilters["images.0"] = { $exists: true };
  if (queryOptions.filter.rating) reviewFilters["rating"] = queryOptions.filter.rating;
  console.log("QueryOptions-->", queryOptions);

  const query = new QueryBuilder(
    Review.find({ product: productId, ...reviewFilters }),
    omit(queryOptions, ["filter"])
  )
    // .filter()
    .sort()
    .paginate()
    .populateDoc({
      populate: "user",
      fields: "user=name,image",
      lean: true
    });

  const reviews = await query.build();
  return JSON.parse(JSON.stringify(reviews)) as ReviewWithUser[];
};
