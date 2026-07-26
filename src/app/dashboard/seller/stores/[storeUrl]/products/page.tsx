import ProductDetails from "@/components/dashboard/forms/product-details";
import { getCategories } from "@/queries/category";

async function AllProductsPage({ params }: { params: { storeUrl: string } }) {
  const { categories } = await getCategories();
  return <ProductDetails categories={categories} storeUrl={params.storeUrl} />;
}

export default AllProductsPage;
