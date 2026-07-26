import StoreDetails from "@/components/dashboard/forms/store-details";
import { StoreDoc } from "@/models/Store";
import { getDocs } from "@/queries/api-query";

async function SellerStoreSettingsPage({ params }: { params: { storeUrl: string } }) {
  const response = await getDocs<{ stores: StoreDoc[] }>(
    `/stores?url=${params.storeUrl}`
  );

  return (
    <div>
      <StoreDetails data={response.stores[0]} />
    </div>
  );
}

export default SellerStoreSettingsPage;
