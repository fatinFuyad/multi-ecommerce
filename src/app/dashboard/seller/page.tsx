import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import Store, { IStore } from "@/models/Store";
import User, { UserData } from "@/models/User";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { TableStores } from "./table";

async function SellerDashboardPage() {
  // prevent non-seller users accessing this page & redirect user to unauthorized;
  const session: Session | null = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "SELLER") return redirect("/error/unauthorized");

  // Alert: mongodb should be connected before querying
  await dbConnect();

  if (!Store.modelName) return <h1>Store model was&appos;nt registered</h1>;

  const seller: (Omit<UserData, "stores"> & { stores: IStore[] }) | null =
    await User.findOne({ _id: user._id })
      .populate({
        path: "stores"
        // select: "name email phone url featured"
      })
      .exec();

  if (!seller) return;

  // if user has no stores & redirect to create new store page
  if (!seller?.stores?.length) {
    return redirect("/dashboard/seller/stores/new");
  }

  // return redirect(`/dashboard/seller/stores/${seller?.stores[0].url}`);

  return (
    <div className="grid gap-6 p-8">
      <h1 className="text-4xl text-cyan-400">Seller Page</h1>
      <h3>Welcome Seller, start managing</h3>
      <p>
        This is the protected SELLER dashboard restricted to users with the
        `SELLER` Role.
      </p>
      <TableStores stores={seller?.stores || []} />
    </div>
  );
}

export default SellerDashboardPage;
