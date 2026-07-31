import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { authorize } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}
export default async function AdminDashboardLayout({
  children
}: Props): Promise<React.ReactNode> {
  const admin = await authorize("ADMIN");

  return (
    <div className="w-full h-full">
      {/* sidebar on the left */}
      <Sidebar isAdmin={true} user={admin} />

      {/* main area with full width */}
      <div className="ml-80">
        <DashboardHeader />

        {/* container wraps children */}
        <div className="mt-20 p-4">{children}</div>
      </div>
    </div>
  );
}
