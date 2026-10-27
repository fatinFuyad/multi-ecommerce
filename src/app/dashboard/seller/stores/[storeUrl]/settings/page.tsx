import StoreDetails from "@/components/dashboard/forms/store-details";
import { IStore } from "@/models/Store";
import { getStore } from "@/services/store";
import { redirect } from "next/navigation";

async function SellerStoreSettingsPage({ params }: { params: { storeUrl: string } }) {
  const store = await getStore<IStore>({
    url: params.storeUrl
  });
  if (!store) redirect("/dashboard/seller/stores");

  return (
    <div>
      <h1>{params.storeUrl}</h1>
      <StoreDetails data={store} />
    </div>
  );
}

export default SellerStoreSettingsPage;
