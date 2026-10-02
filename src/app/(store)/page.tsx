import ProductList from "@/components/store/shared/product-list";
import { getProducts } from "@/services/product";

export default async function HomePage() {
  const homepageProducts = await getProducts();
  return (
    <div className="p-14">
      <ProductList products={homepageProducts} title="Products" arrow />
    </div>
  );
}
