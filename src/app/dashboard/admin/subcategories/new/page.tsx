import SubcategoryDetails from "@/components/dashboard/forms/subcategory-details";
import { getCategories } from "@/services/category";

async function AdminNewSubcategory() {
  const categories = await getCategories();

  return <SubcategoryDetails categories={categories} />;
}

export default AdminNewSubcategory;
