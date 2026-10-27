import ProductList from "@/components/store/shared/product-list";
import { getCardProducts } from "@/services/product";

export default async function HomePage() {
  const productRes = await getCardProducts();
  return (
    <div className="p-14">
      <ProductList products={productRes} title="Products" arrow />
    </div>
  );
}
