import { DashboardSidebarMenuInterface } from "@/lib/types";

export const adminDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
  {
    label: "Dashboard",
    icon: "dashboard",
    link: "/dashboard/admin"
  },
  {
    label: "Stores",
    icon: "store",
    link: "/dashboard/admin/stores"
  },
  {
    label: "Orders",
    icon: "box-list",
    link: "/dashboard/admin/orders"
  },
  {
    label: "Categories",
    icon: "categories",
    link: "/dashboard/admin/categories"
  },
  {
    label: "Sub-Categories",
    icon: "categories",
    link: "/dashboard/admin/subCategories"
  },
  {
    label: "Coupons",
    icon: "coupon",
    link: "/dashboard/admin/coupons"
  },
  {
    label: "Create Store",
    icon: "create-store",
    link: "/dashboard/create-store"
  },
  {
    label: "Update Product",
    icon: "products",
    link: "/products/manage-product/id"
  }
];
