// Clerk
import { currentUser, User } from "@clerk/nextjs/server";

// Custom Ui Components
import {
  adminDashboardSidebarOptions,
  SellerDashboardSidebarOptions
} from "@/constants/data";
import Logo from "../shared/logo";
import SidebarNavAdmin from "./nav-admin";
import UserInfo from "./user-info";
import { StoreData } from "@/models/Store";
import SidebarNavSeller from "./nav-seller";

interface SidebarProps {
  isAdmin?: boolean;
  user: User;
  stores?: StoreData[];
}

async function Sidebar({ isAdmin, user }: SidebarProps) {
  // Get user from admin layout instead of querying again from this component
  // const user = await currentUser();

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
