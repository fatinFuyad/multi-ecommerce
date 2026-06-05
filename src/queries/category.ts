import axios from "@/lib/axios";
import { CategoryFormSchema } from "@/lib/schemas";
import { CategoryData, ICategory } from "@/models/Category";
import { ObjectId } from "mongoose";
import z from "zod";

// make api requests from the frontend for category operations
export async function createCategory(
  values: z.infer<typeof CategoryFormSchema>
): Promise<CategoryData> {
  const response = await axios.post<CategoryData, any, ICategory>(
    "/categories",
    {
      // id: data?._id ? data._id : undefined,
      name: values.name,
      image: values.image[0].url,
      url: values.url,
      featured: values.featured
    }
  );

  return response.data.category;
}

export async function updateCategory(
  _id: ObjectId,
  values: z.infer<typeof CategoryFormSchema>
): Promise<CategoryData> {
  const response = await axios.patch<CategoryData, any, ICategory>(
    `/categories/${_id}`,
    {
      // id: data?._id ? data._id : undefined,
      name: values.name,
      image: values.image[0].url,
      url: values.url,
      featured: values.featured
    }
  );

  return response.data.category;
}

export async function getAllCategories(): Promise<CategoryData[]> {
  const response = await axios.get<
    CategoryData,
    { data: { categories: CategoryData[] } }
  >("/categories");
  return response.data.categories;
}

export async function getCategory(_id: ObjectId) {
  const response = await axios.get<
    CategoryData,
    { data: { category: CategoryData } }
  >(`/categories/${_id}`);
  return response.data.category;
}

export async function deleteCategory(_id: ObjectId) {
  await axios.delete(`/categories/${_id}`);
  return null;
}
