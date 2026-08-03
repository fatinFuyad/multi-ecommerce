import ProductDetails from "@/components/dashboard/forms/product-details";
import { ProductWithVariant } from "@/lib/types";

// Queries
import { getCategories } from "@/queries/category";
import { getOfferTags } from "@/queries/offer-tag";
import { getProductById } from "@/queries/product";

interface Params {
  params: {
    storeUrl: string;
    productId: string;
    variantId: string;
  };
}

export default async function ProductVariantPage({ params }: Params) {
  const { productId, variantId, storeUrl } = params;
  const { categories } = await getCategories();
  const { offerTags } = await getOfferTags();
  const { product } = await getProductById<ProductWithVariant>(productId, undefined, {
    populate: "variants",
    docId: variantId,
    lean: true,
    limitPopulateDoc: 1
  });

  if (!product) return;
  console.log({ product });

  return (
    <div>
      <ProductDetails
        categories={categories}
        offerTags={offerTags}
        storeUrl={storeUrl}
        data={product}
      />
    </div>
  );
}
