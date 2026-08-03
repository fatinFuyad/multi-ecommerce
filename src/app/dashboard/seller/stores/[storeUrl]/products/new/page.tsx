import ProductDetails from "@/components/dashboard/forms/product-details";
import { getCategories } from "@/queries/category";
import { getOfferTags } from "@/queries/offer-tag";

async function NewProductPage({ params }: { params: { storeUrl: string } }) {
  const { categories } = await getCategories();
  const { offerTags } = await getOfferTags();
  return (
    <ProductDetails
      categories={categories}
      offerTags={offerTags}
      storeUrl={params.storeUrl}
    />
  );
}

export default NewProductPage;
