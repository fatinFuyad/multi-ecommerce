import SubcategoryDetails from "@/components/dashboard/forms/subcategory-details";
import axios from "@/lib/axios";

async function AdminNewSubcategory() {
  const response = await axios.get("/categories");
  return <SubcategoryDetails categories={response.data.categories} />;
}

export default AdminNewSubcategory;
