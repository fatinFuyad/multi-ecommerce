// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Custom Ui Components
import { adminDashboardSidebarOptions } from "@/constants/data";
import Logo from "../shared/logo";
import SidebarNavAdmin from "./nav-admin";
import UserInfo from "./user-info";

interface SidebarProps {
  isAdmin?: boolean;
}

async function Sidebar({ isAdmin }: SidebarProps) {
  const user = await currentUser();
  return (
    <div className="w-80 h-screen border-r p-4 flex flex-col fixed top-0 left-0 mb-4">
      <Logo width="100%" height="124px" />
      <span className="mt-3" />
      {user && <UserInfo user={user} />}
      {isAdmin && <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />}
    </div>
  );
}

export default Sidebar;
