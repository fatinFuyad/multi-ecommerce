import StoreDetails from "@/components/dashboard/forms/store-details";
import { getStore } from "@/queries/store";

async function SellerStoreSettingsPage({
  params
}: {
  params: { storeUrl: string };
}) {
  const storeData = await getStore({ findBy: "url", value: params.storeUrl });

  return (
    <div>
      <StoreDetails data={storeData} />
    </div>
  );
}

export default SellerStoreSettingsPage;
