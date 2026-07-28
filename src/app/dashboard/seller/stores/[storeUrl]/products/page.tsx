import ProductDetails from "@/components/dashboard/forms/product-details";
import DataTable from "@/components/ui/data-table";
import { getCategories } from "@/queries/category";
import { getProducts } from "@/queries/product";
import { getStores } from "@/queries/store";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { ProductDetailedType } from "@/lib/types";

export default async function SellerProductsPage({
  params: { storeUrl }
}: {
  params: { storeUrl: string };
}) {
  const { categories } = await getCategories();
  const storeRes = await getStores(`url=${storeUrl}&fields=name,url`);
  const productRes = await getProducts<ProductDetailedType>(
    `store=${storeRes.stores[0]._id}`,
    {
      populate: "category,subcategory,store,variants",
      lean: true
    }
  );

  return (
    <section className="grid gap-4">
      <h1 className="text-3xl text-primary">Seller Products Table</h1>
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Product
          </>
        }
        data={productRes.products}
        columns={columns}
        filterValue="name"
        searchPlaceholder="Search product name..."
        modalChildren={<ProductDetails categories={categories} storeUrl={storeUrl} />}
        newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      />
    </section>
  );
}
