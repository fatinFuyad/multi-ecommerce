import { CategoryData } from "@/models/Category";
import { SubCategoryData } from "@/models/SubCategory";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

// Merging the type of SubCategoryData with CategoryData for category field
// this is essential for defining the popolated data type
export type SubCategoryDataType = SubCategoryData & {
  category: CategoryData;
};
