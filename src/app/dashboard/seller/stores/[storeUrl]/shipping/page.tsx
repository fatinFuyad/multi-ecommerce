import StoreShippingDetails from "@/components/dashboard/forms/store-shipping-details";
import { AdvancedTable } from "@/components/ui/advanced-table";
import { Separator } from "@/components/ui/separator";
import { getStoreShippingRate } from "@/services/shipping-rate";
import { getStore } from "@/services/store";
import { redirect } from "next/navigation";
import { columns } from "./columns";

export default async function StoreShippingPage({
  params
}: {
  params: { storeUrl: string };
}) {
  const store = await getStore({ url: params.storeUrl });
  const shippingRates = await getStoreShippingRate(store._id);
  if (!store || shippingRates.length === 0) return redirect("/error");

  return (
    <div>
      <StoreShippingDetails data={store} />
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
