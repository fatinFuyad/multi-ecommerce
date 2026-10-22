import ProductDetails from "@/components/dashboard/forms/product-details";
import { IProduct } from "@/models/Product";
import { Country, ICountry } from "@/models/Shipping-Rate";
import { getCategories } from "@/queries/category";
import { getOfferTags } from "@/queries/offer-tag";
import { getProductById } from "@/queries/product";
import { Types } from "mongoose";

async function NewPrductVariantPage({
  params
}: {
  params: { storeUrl: string; productId: Types.ObjectId };
}) {
  const [categoriesRes, offerTagsRes, countriesRes] = await Promise.all([
    getCategories(),
    getOfferTags(),
    Country.find().sort({ name: "asc" }).lean()
  ]);
  const countries: ICountry[] = JSON.parse(JSON.stringify(countriesRes));

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
      categories={categoriesRes.categories}
      offerTags={offerTagsRes.offerTags}
      storeUrl={params.storeUrl}
      countries={countries}
    />
  );
}

export default NewPrductVariantPage;
