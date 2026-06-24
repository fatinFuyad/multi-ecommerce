import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

async function SellerStoreLayout({ children }: { children: ReactNode }) {
  // Fetch the current user. If the user is not authenticated, redirect them to the home page.
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect("/signin"); // Ensure no further code is executed after redirect
  }

  return (
    <div className="w-full h-full">
      {/* sidebar on the left */}
      <Sidebar isAdmin={false} user={session.user} />

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
