import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/dbConnect";
import Store, { IStore } from "@/models/Store";
import User, { UserDoc } from "@/models/User";
import { PopulateOptions } from "mongoose";
import { redirect } from "next/navigation";
// import { TableStores } from "./table";

async function SellerDashboardPage() {
  // prevent non-seller users accessing this page & redirect user to unauthorized;
  const { user } = await auth();
  if (user.role !== "SELLER") return redirect("/error/unauthorized");

  // Alert: mongodb should be connected before querying
  await dbConnect();

  if (!Store.modelName) return <h1>Store model was&appos;nt registered</h1>;

  const seller:
    | (Omit<UserDoc, "stores"> & { stores: Pick<IStore, "_id" | "url">[] })
    | null = await User.findOne({ _id: user._id })
    .sort({ createdAt: "asc" })
    .populate({
      path: "stores",
      select: "url", // "name email phone url featured"
      options: {
        limit: 1 // limits number of docs from the populate reference array
      }
    } satisfies PopulateOptions)
    .exec();

  if (!seller) return null;

  // if user has no stores & redirect to create new store page
  if (!seller.stores.length) {
    return redirect("/dashboard/seller/stores/new");
  }

  // if seller has stores & redirect them to them latest store
  return redirect(`/dashboard/seller/stores/${seller.stores[0].url}`);

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
