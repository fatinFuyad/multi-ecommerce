import ProductDetails from "@/components/dashboard/forms/product-details";
import { IProduct } from "@/models/Product";
import { getAllCategories } from "@/queries/category";
import { getProductById } from "@/queries/product";

async function NewPrductVariantPage({
  params
}: {
  params: { storeUrl: string; productId: string };
}) {
  const categories = await getAllCategories();
  const fields = ["name", "brand", "description", "subcategory", "category"] as const;
  const res = await getProductById<Pick<IProduct, (typeof fields)[number]>>(
    params.productId,
    { lean: true, fields: fields }
  );

  if (!res.product) return <h2>No Product ⚠️</h2>;
  return (
    <ProductDetails
      data={res.product}
      categories={categories}
      storeUrl={params.storeUrl}
    />
  );
}

export default NewPrductVariantPage;
