// React
import { ReactNode } from "react";

// Components
import Header from "@/components/store/layout/header/header";
import Footer from "@/components/store/layout/footer/footer";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import { Toaster } from "react-hot-toast";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[101vh] min-h-screen">
      <Header />
      <CategoriesHeader />
      <div>{children}</div>
      <div className="h-96"></div>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              backgroundColor: "#0284c7",
              color: "#fff4f6"
            }
          },
          error: {
            duration: 5000,
            style: {
              backgroundColor: "#dc2626",
              color: "#fff4f6"
            }
          }
        }}
      />
    </div>
  );
}
