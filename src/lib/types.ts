import { ICategory } from "@/models/Category";
import { IProduct, IProductVariant } from "@/models/Product";
import { IStore } from "@/models/Store";
import { ISubcategory } from "@/models/Subcategory";
import { IUser } from "@/models/User";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

//  response from the backend api route
type BaseResponse = {
  success: boolean;
  status: number;
  total?: number;
  message?: string;
  error?: string;
};
/*
type BaseResponse = {
  success: boolean;
} & (
  | { success: true; message: string; status: 200 | 201 }
  | { success: false; error: string; status: 400 | 404 | 500 }
);
*/

// dynamic property type // interfaced can't be dynamic mapped type
export type ApiResponse<T = { data: null }> = {
  [k in keyof T]: T[k];
} & BaseResponse;

// Merging the type of Subcategory with Category for category field
// this is essential for defining the popolated data type
export type SubcategoryWithCategory = Omit<ISubcategory, "category"> & {
  category: ICategory;
};

export type UserWithStore = Omit<IUser, "stores"> & {
  stores: IStore[];
};

export type ProductWithVariant = Omit<IProduct, "variants"> & {
  variants: IProductVariant[];
};

export type ProductDetailedType = Omit<
  IProduct,
  "variants" | "subcategory" | "category" | "store"
> & {
  variants: IProductVariant[];
  subcategory: ISubcategory;
  category: ICategory;
  store: IStore;
};

//
export type MergeType<T, U> = Omit<T, keyof U> & U;

export type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};
