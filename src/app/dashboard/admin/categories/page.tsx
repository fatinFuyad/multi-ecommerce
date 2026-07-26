import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { getCategories } from "@/queries/category";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminCategoriesPage() {
  const { categories } = await getCategories();

  return (
    <section className="grid gap-4">
      <h1 className="text-3xl text-primary">Category page</h1>{" "}
      <h3>Create categories for your products mangements</h3>
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
        modalChildren={<CategoryDetails />}
        newTabLink="/dashboard/admin/categories/new"
      />
    </section>
  );
}
