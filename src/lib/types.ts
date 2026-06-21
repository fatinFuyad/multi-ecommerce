import { CategoryData } from "@/models/Category";
import { StoreData } from "@/models/Store";
import { SubCategoryData } from "@/models/SubCategory";
import { UserData } from "@/models/User";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

// Axios response from the backend api route

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  status: number;
  message?: string;
}

// Merging the type of SubCategoryData with CategoryData for category field
// this is essential for defining the popolated data type
export type SubCategoryDataType = SubCategoryData & {
  category: CategoryData;
};

export type UserWithStoreType = UserData & {
  stores: StoreData[];
};

export type MergeType<T, U> = Omit<T, keyof U> & U;

export type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};
