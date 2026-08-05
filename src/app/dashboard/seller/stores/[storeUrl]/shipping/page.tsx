import StoreShippingDetails from "@/components/dashboard/forms/store-shipping-details";
import { getStores } from "@/queries/store";
import { redirect } from "next/navigation";

export default async function StoreShippingPage({
  params
}: {
  params: { storeUrl: string };
}) {
  const { stores } = await getStores(`url=${params.storeUrl}`);
  if (!stores?.[0]) return redirect("/dashboard");
  return <StoreShippingDetails data={stores[0]} />;
}
