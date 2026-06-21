import { ReactNode } from "react";

async function SellerDashboardLayout({ children }: { children: ReactNode }) {
  // prevent non-seller users accessing this page & redirect user to homepage;
  // const user = await currentUser();

  // if (user?.privateMetadata.role !== "SELLER") return redirect("/");

  return (
    <div>
      {/* <SellerDashboardPage user={user} /> */}
      {children}
    </div>
  );
}

export default SellerDashboardLayout;
