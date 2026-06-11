import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  // Checking if no categories are found
  // if (!categories.length) return <h2>No categories found</h2>;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      data={categories}
      columns={columns}
      filterValue="name"
      searchPlaceholder="Search category name..."
      modalChildren={
        <CategoryDetails /> // need not to pass data prop when create a category
      }
      newTabLink="/dashboard/admin/categories/new"
    />
  );
}
