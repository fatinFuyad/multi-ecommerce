import ProductDetails from "@/components/dashboard/forms/product-details";
import { MergeType, ProductWithVariant } from "@/lib/types";
import { Country, ICountry, IFreeShipping } from "@/models/Shipping-Rate";

// Queries
import { getCategories } from "@/services/category";
import { getOfferTags } from "@/services/offer-tag";
import { getProductById } from "@/services/product";

interface Params {
  params: {
    storeUrl: string;
    productId: string;
    variantId: string;
  };
}

export default async function ProductVariantPage({ params }: Params) {
  const { productId, variantId, storeUrl } = params;
  const [categoriesRes, offerTagsRes, countriesRes] = await Promise.all([
    getCategories(),
    getOfferTags(),
    Country.find().sort({ name: "asc" }).lean()
  ]);

  const countries: ICountry[] = JSON.parse(JSON.stringify(countriesRes));

  const product = await getProductById<
    MergeType<ProductWithVariant, { freeShipping: IFreeShipping }>
  >(productId, {
    populate: "variants,freeShipping",
    docId: variantId,
    lean: true,
    limitPopulateDoc: 1
  });
  if (!product) return;

  return (
    <div>
      <ProductDetails
        categories={categoriesRes}
        offerTags={offerTagsRes}
        storeUrl={storeUrl}
        countries={countries}
        data={product}
      />
    </div>
  );
}
