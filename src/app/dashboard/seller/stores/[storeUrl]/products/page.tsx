import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";

async function AllProductsPage({ params }: { params: { storeUrl: string } }) {
  const categories = await getAllCategories();
  return <ProductDetails categories={categories} storeUrl={params.storeUrl} />;
}

export default AllProductsPage;
