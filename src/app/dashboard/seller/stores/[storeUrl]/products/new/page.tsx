import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";

async function NewProductPage() {
  const categories = await getAllCategories();
  return <ProductDetails categories={categories} />;
}

export default NewProductPage;
