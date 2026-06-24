import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import axios from "@/lib/axios";

async function AdminNewSubCategory() {
  const response = await axios.get("/categories");
  return <SubCategoryDetails categories={response.data.categories} />;
}

export default AdminNewSubCategory;
