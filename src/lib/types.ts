import { CategoryData } from "@/models/Category";
import { StoreData } from "@/models/Store";
import { SubCategoryData } from "@/models/SubCategory";
import { UserData } from "@/models/User";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

//  response from the backend api route
type BaseResponse = {
  success: boolean;
  status: number;
  message?: string;
  error?: string;
};

// dynamic property type // interfaced can't be dynamic mapped type
export type ApiResponse<T = { data: null }> = {
  [k in keyof T]: T[k];
} & BaseResponse;

// Merging the type of SubCategoryData with CategoryData for category field
// this is essential for defining the popolated data type
export type SubCategoryWithCateogry = Omit<SubCategoryData, "category"> & {
  category: CategoryData;
};

export type UserWithStore = Omit<UserData, "stores"> & {
  stores: StoreData[];
};

export type MergeType<T, U> = Omit<T, keyof U> & U;

export type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};
