import { dbConnect } from "@/lib/db-connect";
import {
  ProductDetailedDocType,
  ProductWithVariant,
  UserCountry,
  VariantImageType,
  VariantSimplified
} from "@/lib/types";

import Product, { ProductVariant, ProductVariantSchema } from "@/models/Product";

import {
  Country,
  FreeShipping,
  FreeShippingWithCountries,
  ShippingRate,
  ShippingRateSchema
} from "@/models/Shipping-Rate";
import { StoreSchema } from "@/models/Store";
import { getCookie } from "cookies-next";
import { HydratedDocument } from "mongoose";
import { cookies } from "next/headers";

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
 * get all of the products with variants data populated
 * @returns productsWithFilteredVariants
 */
export async function getFilteredProducts() {
  const products: ProductWithVariant[] = await Product.find().populate({
    path: "variants"
  });

  // Transform the products with filtered variants into ProductCardType structure
  const productsWithFilteredVariants = products.map((product) => {
    // Filter the variants based on the filters
    const filteredVariants = product.variants;

    // Transform the filtered variants into the VariantSimplified structure
    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant._id.toString(),
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes
    }));

    // Extract variant images for the product
    const variantImages: VariantImageType[] = filteredVariants.map((variant) => ({
      url: `/product/${product.slug}/${variant.slug}`,
      image: variant.variantImage ? variant.variantImage : variant.images[0].url
    }));

    // Return the product in the ProductCardType structure
    return {
      _id: product._id.toString(),
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      sales: product.sales,
      variants,
      variantImages
    };
  });

  return productsWithFilteredVariants;
}

/**
 * @description Get products data for product-page from the database.
 * @access Level: Public
 * @returns requested productPageData.
 */
export async function getProductPageData(productSlug: string, variantSlug: string) {
  try {
    await dbConnect();

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

    /**
       product: ProductPageType, // includes variants (active), variantInfo (all)
       shippingDetails: ProductShippingDetailsType,
       storeFollwersCount: number,
       isUserFollowingStore: boolean,
       ratingStatistics: RatingStatisticsType
     */

    return JSON.parse(
      JSON.stringify({
        product,
        variants,
        userCountry,
        shippingDetails,
        freeShipping
      })
    );
  } catch (error: any) {
    return { message: error.message };
  }
}
