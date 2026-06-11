import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { Plus } from "lucide-react";
import { columns } from "./columns";

async function AdminSubCategoriesPage() {
  const subCategories = await getAllSubCategories();
  const categories = await getAllCategories();

  // if (!subCategories.length)
  //   return (
  //     <div>
  //       <h2>No Subcategories found!</h2>
  //     </div>
  //   );

  return (
    <div>
      <h1>SubCategory page</h1>
      <p>Create subCategories for your products mangements</p>
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create SubCategory
          </>
        }
        data={subCategories}
        columns={columns}
        modalChildren={<SubCategoryDetails categories={categories} />}
        newTabLink="/dashboard/admin/subCategories/new"
        filterValue="name"
        searchPlaceholder="Filter subcategories by name"
      />
    </div>
  );
}

export default AdminSubCategoriesPage;
