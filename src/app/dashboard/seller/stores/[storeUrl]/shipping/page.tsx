import StoreShippingDetails from "@/components/dashboard/forms/store-shipping-details";
import { AdvancedTable } from "@/components/ui/advanced-table";
import { getShippingRates, getStores } from "@/queries/store";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { Separator } from "@/components/ui/separator";

export default async function StoreShippingPage({
  params
}: {
  params: { storeUrl: string };
}) {
  const { stores } = await getStores(`url=${params.storeUrl}`);
  const { shippingRates } = await getShippingRates(stores[0]._id);
  if (!stores?.length || shippingRates.length === 0) return redirect("/error");

  return (
    <div>
      <StoreShippingDetails data={stores[0]} />
      <div className="mt-20 mb-20">
        <h3>Shipping rate details across different country</h3>
        <Separator className="mb-10" />
        <AdvancedTable
          data={shippingRates}
          columns={columns}
          filterValue="countryName" // filter does not work for nested field / property
          searchPlaceholder="Search by country name..."
          heading="Shpping rates across different countries"
        />
      </div>
    </div>
  );
}
