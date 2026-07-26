import ProductDetails from "@/components/dashboard/forms/product-details";
import { getCategories } from "@/queries/category";

async function NewProductPage({ params }: { params: { storeUrl: string } }) {
  const { categories } = await getCategories();
  return <ProductDetails categories={categories} storeUrl={params.storeUrl} />;
}

export default NewProductPage;
