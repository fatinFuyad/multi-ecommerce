import StoreDetails from "@/components/dashboard/forms/store-details";
import { IStore } from "@/models/Store";
import { getDocs } from "@/queries/api-query";

async function SellerStoreSettingsPage({ params }: { params: { storeUrl: string } }) {
  const response = await getDocs<{ stores: IStore[] }>(`/stores?url=${params.storeUrl}`);

  return (
    <div>
      <StoreDetails data={response.stores[0]} />
    </div>
  );
}

export default SellerStoreSettingsPage;
