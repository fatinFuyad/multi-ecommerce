import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import DataTable from "@/components/ui/data-table";
import { SubCategoryWithCateogry } from "@/lib/types";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

async function AdminSubCategoriesPage() {
  const categories = await getAllCategories();
  const subCategories = await getAllSubCategories<SubCategoryWithCateogry>({
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
        modalChildren={<SubCategoryDetails categories={categories} />}
        newTabLink="/dashboard/admin/subCategories/new"
        filterValue="name"
        searchPlaceholder="Filter subcategories by name"
      />
    </section>
  );
}

export default AdminSubCategoriesPage;
