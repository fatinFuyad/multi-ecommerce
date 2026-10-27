import ProductDetails from "@/components/dashboard/forms/product-details";
import DataTable from "@/components/ui/data-table";
import { ProductDetailedType } from "@/lib/types";
import { Country, ICountry } from "@/models/Shipping-Rate";
import { getCategories } from "@/services/category";
import { getOfferTags } from "@/services/offer-tag";
import { getProducts } from "@/services/product";
import { getStores } from "@/services/store";
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
    getStores({ url: storeUrl, fields: "name,url" })
  ]);
  const countries: ICountry[] = JSON.parse(JSON.stringify(countriesRes));

  const products = await getProducts<ProductDetailedType>(
    { store: storeRes[0]._id },
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
        data={products || []}
        columns={columns}
        filterValue="name"
        searchPlaceholder="Search product name..."
        modalChildren={
          <ProductDetails
            categories={categoriesRes}
            offerTags={offerTagsRes}
            storeUrl={storeUrl}
            countries={countries}
          />
        }
        newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      />
    </section>
  );
}
