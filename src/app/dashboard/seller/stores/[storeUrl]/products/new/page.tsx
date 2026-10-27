import ProductDetails from "@/components/dashboard/forms/product-details";
import { Country, ICountry } from "@/models/Shipping-Rate";
import { getCategories } from "@/services/category";
import { getOfferTags } from "@/services/offer-tag";

async function NewProductPage({ params }: { params: { storeUrl: string } }) {
  const [categoriesRes, offerTagsRes, countriesRes] = await Promise.all([
    getCategories(),
    getOfferTags(),
    Country.find().sort({ name: "asc" }).lean()
  ]);
  const countries: ICountry[] = JSON.parse(JSON.stringify(countriesRes));

  return (
    <ProductDetails
      categories={categoriesRes}
      offerTags={offerTagsRes}
      storeUrl={params.storeUrl}
      countries={countries}
    />
  );
}

export default NewProductPage;
