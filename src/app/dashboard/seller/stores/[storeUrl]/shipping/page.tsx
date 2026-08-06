import StoreShippingDetails from "@/components/dashboard/forms/store-shipping-details";
import DataTable from "@/components/ui/data-table";
import { getShippingRates, getStores } from "@/queries/store";
import { redirect } from "next/navigation";
import { columns } from "./columns";

export default async function StoreShippingPage({
  params
}: {
  params: { storeUrl: string };
}) {
  const { stores } = await getStores(`url=${params.storeUrl}`);
  const { shippingRates } = await getShippingRates(stores[0]._id);
  if (!stores?.length || shippingRates.length === 0) return redirect("/dashboard");

  return (
    <div>
      <StoreShippingDetails data={stores[0]} />
      <div className="mt-10">
        <DataTable
          filterValue="countryName"
          data={shippingRates}
          columns={columns}
          searchPlaceholder="Search by country name..."
        />
      </div>
    </div>
  );
}
