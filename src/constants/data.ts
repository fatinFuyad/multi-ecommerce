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
    label: "Subcategories",
    icon: "categories",
    link: "/dashboard/admin/subcategories"
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

export const SellerDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
  {
    label: "Dashboard",
    icon: "dashboard",
    link: ""
  },
  {
    label: "Products",
    icon: "products",
    link: "products"
  },
  {
    label: "Orders",
    icon: "box-list",
    link: "orders"
  },
  {
    label: "Inventory",
    icon: "inventory",
    link: "inventory"
  },
  {
    label: "Coupons",
    icon: "coupon",
    link: "coupons"
  },
  {
    label: "Shipping",
    icon: "shipping",
    link: "shipping"
  },
  {
    label: "Settings",
    icon: "settings",
    link: "settings"
  }
];
