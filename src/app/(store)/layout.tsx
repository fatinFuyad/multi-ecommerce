// React
import { ReactNode } from "react";

// Components
import Header from "@/components/store/layout/header/header";
import Footer from "@/components/store/layout/footer/footer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[101vh] min-h-screen">
      <Header />
      <div>{children}</div>
      <div className="h-96"></div>
      <Footer />
    </div>
  );
}
