import ProductDetails from "@/components/dashboard/forms/product-details";
import { IProduct } from "@/models/Product";
import { getCategories } from "@/queries/category";
import { getOfferTags } from "@/queries/offer-tag";
import { getProductById } from "@/queries/product";
import { Types } from "mongoose";

async function NewPrductVariantPage({
  params
}: {
  params: { storeUrl: string; productId: Types.ObjectId };
}) {
  const { categories } = await getCategories();
  const { offerTags } = await getOfferTags();

  const fields = [
    "name",
    "brand",
    "description",
    "subcategory",
    "category",
    "offerTag"
  ] as const;
  const res = await getProductById<Pick<IProduct, (typeof fields)[number]>>(
    params.productId,
    `fields:${fields.join(",")}`,
    {
      lean: true
    }
  );

  if (!res.product) return <h2>No Product ⚠️</h2>;
  return (
    <ProductDetails
      data={res.product}
      categories={categories}
      offerTags={offerTags}
      storeUrl={params.storeUrl}
    />
  );
}

export default NewPrductVariantPage;
