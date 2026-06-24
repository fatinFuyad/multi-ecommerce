// Custom Ui Components
import {
  adminDashboardSidebarOptions,
  SellerDashboardSidebarOptions
} from "@/constants/data";
import { SessionUser } from "@/types/next-auth";
import Logo from "../shared/logo";
import SidebarNavAdmin from "./nav-admin";
import SidebarNavSeller from "./nav-seller";
import UserInfo from "./user-info";

interface SidebarProps {
  isAdmin?: boolean;
  user: SessionUser;
}

async function Sidebar({ isAdmin, user }: SidebarProps) {
  return (
    <div className="w-80 h-screen border-r p-4 flex flex-col fixed top-0 left-0 mb-4">
      <Logo width="100%" height="124px" />
      <span className="mt-3" />
      {user && <UserInfo user={user} />}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions} />
      )}
    </div>
  );
}

export default Sidebar;
