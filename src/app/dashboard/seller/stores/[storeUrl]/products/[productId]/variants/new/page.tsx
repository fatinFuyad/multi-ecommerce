import ProductDetails from "@/components/dashboard/forms/product-details";
import { IProduct } from "@/models/Product";
import { getAllCategories } from "@/queries/category";
import { getProductById } from "@/queries/product";
import { Types } from "mongoose";

async function NewPrductVariantPage({
  params
}: {
  params: { storeUrl: string; productId: Types.ObjectId };
}) {
  const categories = await getAllCategories();
  const fields = ["name", "brand", "description", "subcategory", "category"] as const;
  const res = await getProductById<Pick<IProduct, (typeof fields)[number]>>(
    params.productId,
    { lean: true, fields: fields }
  );
  return (
    <ProductDetails
      data={res.product}
      categories={categories}
      storeUrl={params.storeUrl}
    />
  );
}

export default NewPrductVariantPage;
