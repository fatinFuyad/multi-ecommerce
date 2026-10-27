import ProductDetails from "@/components/dashboard/forms/product-details";
import { IProduct } from "@/models/Product";
import { Country, ICountry } from "@/models/Shipping-Rate";
import { getCategories } from "@/services/category";
import { getOfferTags } from "@/services/offer-tag";
import { getProductById } from "@/services/product";

async function NewPrductVariantPage({
  params
}: {
  params: { storeUrl: string; productId: string };
}) {
  const [categories, offerTags, countriesRes] = await Promise.all([
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
  const product = await getProductById<Pick<IProduct, (typeof fields)[number]>>(
    params.productId,
    { fields: fields.join(",") }
  );

  if (!product) return <h2>No Product ⚠️</h2>;
  return (
    <ProductDetails
      data={product}
      categories={categories}
      offerTags={offerTags}
      storeUrl={params.storeUrl}
      countries={countries}
    />
  );
}

export default NewPrductVariantPage;
