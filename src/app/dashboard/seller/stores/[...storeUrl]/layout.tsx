import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { dbConnect } from "@/lib/dbConnect";
import { UserWithStoreType } from "@/lib/types";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

async function SellerStoreLayout({ children }: { children: ReactNode }) {
  // Fetch the current user. If the user is not authenticated, redirect them to the home page.
  const user = await currentUser();
  if (!user) {
    return redirect("/");
    // Ensure no further code is executed after redirect
  }

  // Retrieve the list of stores associated with the authenticated user.

  // Alert: mongodb should be connected before querying
  await dbConnect();
  const userData = await User.findOne<UserWithStoreType>({
    clerkId: user.id
  }).populate({ path: "stores" });

  return (
    <div className="w-full h-full">
      {/* sidebar on the left */}
      <Sidebar isAdmin={false} user={user} stores={userData?.stores} />

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
