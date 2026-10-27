import { authorize } from "@/lib/auth";
import { getStores } from "@/services/store";
import { redirect } from "next/navigation";

async function SellerDashboardPage() {
  // prevent non-seller users accessing this page & redirect user to unauthorized;
  const user = await authorize("SELLER");

  const stores = await getStores({ user: user._id, fields: "url" });

  // if user has no stores & redirect to create new store page
  if (!stores.length) {
    return redirect("/dashboard/seller/stores/new");
  }

  // if seller has stores & redirect them to them latest store
  return redirect(`/dashboard/seller/stores/${stores[0].url}`);

  // return (
  //   <div className="grid gap-6 p-8">
  //     <h1 className="text-4xl text-cyan-400">Seller Page</h1>
  //     <h3>Welcome Seller, start managing</h3>
  //     <p>
  //       This is the protected SELLER dashboard restricted to users with the
  //       `SELLER` Role.
  //     </p>
  //     <TableStores stores={seller?.stores || []} />
  //   </div>
  // );
}

export default SellerDashboardPage;
