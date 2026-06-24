import { ReactNode } from "react";

async function SellerDashboardLayout({ children }: { children: ReactNode }) {
  // prevent non-seller users accessing this page & redirect user to homepage;

  return <div>{children}</div>;
}

export default SellerDashboardLayout;
