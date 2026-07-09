import { CategoryDoc } from "@/models/Category";
import { StoreDoc } from "@/models/Store";
import { SubCategoryDoc } from "@/models/SubCategory";
import { UserDoc } from "@/models/User";

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

// Merging the type of SubCategoryDoc with CategoryDoc for category field
// this is essential for defining the popolated data type
export type SubCategoryWithCateogry = Omit<SubCategoryDoc, "category"> & {
  category: CategoryDoc;
};

export type UserWithStore = Omit<UserDoc, "stores"> & {
  stores: StoreDoc[];
};

export type MergeType<T, U> = Omit<T, keyof U> & U;

export type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};
