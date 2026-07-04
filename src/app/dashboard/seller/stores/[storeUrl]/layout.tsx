import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { auth } from "@/lib/auth";
import Store from "@/models/Store";

async function SellerStoreLayout({ children }: { children: React.ReactNode }) {
  const { user } = await auth();
  console.log(user);
  const stores = await Store.find({
    user: user._id
  })
    .select("name email phone url featured")
    .lean();

  const storeItems = JSON.parse(JSON.stringify(stores));
  // lean makes the doc to plain object but the _id is still needs to string
  // const storeItems = stores.map((store) => ({
  //   ...store,
  //   _id: (store._id as object).toString()
  // }));

  console.log("Store layout ---> ", stores);
  return (
    <div className="w-full h-full">
      {/* sidebar on the left */}
      <Sidebar isAdmin={false} user={user} stores={storeItems} />

      {/* main area with full width */}
      <div className="ml-80">
        <DashboardHeader />

        {/* container wraps children */}
        <div className="mt-20 p-4">{children}</div>
      </div>
    </div>
  );
}

export default SellerStoreLayout;
