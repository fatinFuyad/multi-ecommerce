import ProductDetails from "@/components/dashboard/forms/product-details";
import DataTable from "@/components/ui/data-table";
import { ProductDetailedType } from "@/lib/types";
import { Country, ICountry } from "@/models/Shipping-Rate";
import { getCategories } from "@/queries/category";
import { getOfferTags } from "@/queries/offer-tag";
import { getProducts } from "@/queries/product";
import { getStores } from "@/queries/store";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function SellerProductsPage({
  params: { storeUrl }
}: {
  params: { storeUrl: string };
}) {
  const [categoriesRes, offerTagsRes, countriesRes, storeRes] = await Promise.all([
    getCategories(),
    getOfferTags(),
    Country.find().sort({ name: "asc" }).lean(),
    getStores(`url=${storeUrl}&fields=name,url`)
  ]);
  const countries: ICountry[] = JSON.parse(JSON.stringify(countriesRes));

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
        data={productRes.products || []}
        columns={columns}
        filterValue="name"
        searchPlaceholder="Search product name..."
        modalChildren={
          <ProductDetails
            categories={categoriesRes.categories}
            offerTags={offerTagsRes.offerTags}
            storeUrl={storeUrl}
            countries={countries}
          />
        }
        newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      />
    </section>
  );
}
