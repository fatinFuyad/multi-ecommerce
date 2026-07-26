import ProductDetails from "@/components/dashboard/forms/product-details";
import { ProductDoc } from "@/models/Product";
import { getCategories } from "@/queries/category";
import { getProductById } from "@/queries/product";
import { Types } from "mongoose";

async function NewPrductVariantPage({
  params
}: {
  params: { storeUrl: string; productId: Types.ObjectId };
}) {
  const { categories } = await getCategories();
  const fields = ["name", "brand", "description", "subcategory", "category"] as const;
  const res = await getProductById<Pick<ProductDoc, (typeof fields)[number]>>(
    params.productId,
    `fields:${fields.join(",")}`,
    {
      lean: true
    }
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
