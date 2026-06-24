import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}
export default async function AdminDashboardLayout({
  children
}: Props): Promise<React.ReactNode> {
  const session: Session | null = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "ADMIN") return redirect("/error/unauthorized");

  return (
    <div className="w-full h-full">
      {/* sidebar on the left */}
      <Sidebar isAdmin={true} user={user} />

      {/* main area with full width */}
      <div className="ml-80">
        <DashboardHeader />

        {/* container wraps children */}
        <div className="mt-20 p-4">{children}</div>
      </div>
    </div>
  );
}
