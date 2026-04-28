import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}
export default async function AdminDashboardLayout({
  children
}: Props): Promise<React.ReactNode> {
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== "ADMIN") redirect("/");

  return (
    <div className="w-full h-full">
      {/* sidebar on the left */}
      <Sidebar isAdmin />

      {/* main area with full width */}
      <div className="ml-80">
        <DashboardHeader />

        {/* container wraps children */}
        <div className="mt-20 p-4">{children}</div>
      </div>
    </div>
  );
}
