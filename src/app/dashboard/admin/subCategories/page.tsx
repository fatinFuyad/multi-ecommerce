import SubcategoryDetails from "@/components/dashboard/forms/subcategory-details";
import DataTable from "@/components/ui/data-table";
import { SubcategoryWithCateogry } from "@/lib/types";
import { getCategories } from "@/queries/category";
import { getSubcategories } from "@/queries/subcategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

async function AdminSubcategoriesPage() {
  const { categories } = await getCategories();
  const { subcategories } = await getSubcategories<SubcategoryWithCateogry>(undefined, {
    populate: ["category"]
  });

  return (
    <section className="grid gap-4">
      <h1 className="text-3xl text-primary">Subcategory page</h1>
      <h3>Create subcategories for your products mangements</h3>
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Subcategory
          </>
        }
        data={subcategories}
        columns={columns}
        modalChildren={<SubcategoryDetails categories={categories} />}
        newTabLink="/dashboard/admin/subcategories/new"
        filterValue="name"
        searchPlaceholder="Filter subcategories by name"
      />
    </section>
  );
}

export default AdminSubcategoriesPage;
