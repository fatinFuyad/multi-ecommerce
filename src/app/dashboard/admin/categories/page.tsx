import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  // Checking if no categories are found
  if (!categories) return <h2>No categories found</h2>;

  return (
    <DataTable
      data={categories}
      columns={columns}
      filterValue="name"
      searchPlaceholder="Search category name..."
      modalChildren={
        // need not to pass data prop when create a category
        <CategoryDetails />
      }
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
    />
  );
}
// return (
//   <div>
//     <ul>
//       {categories.map((category: CategoryData) => {
//         return (
//           <li key={category._id.toString()}>
//             <p>{category.name}</p>
//             <p>{category.url}</p>
//           </li>
//         );
//       })}
//     </ul>
//   </div>
// );
