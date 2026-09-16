import ProductList from "@/components/store/shared/product-list";
import { getFilteredProducts } from "@/services/product";

export default async function HomePage() {
  const productsWithFilteredVariants = await getFilteredProducts();
  return (
    <div className="p-14">
      <ProductList products={productsWithFilteredVariants} title="Products" arrow />
    </div>
  );
}
