import { dbConnect } from "@/lib/dbConnect";
import { MergeType } from "@/lib/types";
import User, { UserData } from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// interface SellerDashboardPageProps {
//   user: ClerkUser;
// }

async function SellerDashboardPage() {
  // prevent non-seller users accessing this page & redirect user to homepage;

  const user = await currentUser();

  if (user?.privateMetadata.role !== "SELLER")
    return redirect("/error/unauthorized");
  // Retrieve the list of stores associated with the authenticated user.

  // Alert: mongodb should be connected before querying
  await dbConnect();
  const sellerData = await User.findOne<
    MergeType<UserData, { stores: { url: string }[] }>
  >({
    clerkId: user.id
  }).populate({ path: "stores", select: "url" });

  // const stores = await Store.find({user }); // can't find store as we don't have user's mongodb _id

  console.log({ sellerData });
  // if user has no stores & redirect to create new store page
  // if (!sellerData?.stores.length) {
  if (!sellerData?.stores?.length) {
    return redirect("/dashboard/seller/stores/new");
  }

  return redirect(`/dashboard/seller/stores/${sellerData?.stores[0].url}`);

  // return (
  //   <div className="grid gap-6 p-8">
  //     <h1 className="text-4xl text-cyan-400">Seller Page</h1>
  //     <h3>Welcome Seller, start managing</h3>
  //     <p>
  //       This is the protected SELLER dashboard restricted to users with the
  //       `SELLER` Role.
  //     </p>
  //   </div>
  // );
}

export default SellerDashboardPage;
