import SubcategoryDetails from "@/components/dashboard/forms/subcategory-details";
import DataTable from "@/components/ui/data-table";
import { SubcategoryWithCateogry } from "@/lib/types";
import { getAllCategories } from "@/queries/category";
import { getAllSubcategories } from "@/queries/subcategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

async function AdminSubcategoriesPage() {
  const categories = await getAllCategories();
  const subCategories = await getAllSubcategories<SubcategoryWithCateogry>({
    populate: "category"
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
        data={subCategories}
        columns={columns}
        modalChildren={<SubcategoryDetails categories={categories} />}
        newTabLink="/dashboard/admin/subCategories/new"
        filterValue="name"
        searchPlaceholder="Filter subcategories by name"
      />
    </section>
  );
}

export default AdminSubcategoriesPage;
