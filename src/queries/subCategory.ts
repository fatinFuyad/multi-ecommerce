import axios from "@/lib/axios";
import { SubCategoryFormSchema } from "@/lib/schemas";
import { SubCategoryDataType } from "@/lib/types";
import { ISubCategory, SubCategoryData } from "@/models/SubCategory";
import mongoose from "mongoose";
import z from "zod";

// make api requests from the frontend for SubCategory operations
export async function createSubCategory(
  values: z.infer<typeof SubCategoryFormSchema>
): Promise<SubCategoryData> {
  const typesId = new mongoose.Types.ObjectId(values.category);
  console.log({
    typesId,
    typeTypesId: typeof typesId
  });
  const response = await axios.post<SubCategoryData, any>("/subCategories", {
    // id: data?._id ? data._id : undefined,
    name: values.name,
    image: values.image[0].url,
    url: values.url,
    featured: values.featured,
    category: values.category
  });

  return response.data.subCategory;
}

export async function updateSubCategory(
  _id: mongoose.Types.ObjectId,
  values: z.infer<typeof SubCategoryFormSchema>
): Promise<SubCategoryData> {
  const response = await axios.patch<SubCategoryData, any, ISubCategory>(
    `/subCategories/${_id}`,
    {
      name: values.name,
      image: values.image[0].url,
      url: values.url,
      featured: values.featured,
      category: new mongoose.Types.ObjectId(values.category)
    }
  );

  return response.data.subCategory;
}

export async function getAllSubCategories(): Promise<SubCategoryDataType[]> {
  console.log("getAllSubCategories");
  try {
    const response = await axios.get<
      SubCategoryDataType,
      { data: { subCategories: SubCategoryDataType[] } }
    >("/subCategories");

    return response.data.subCategories;
  } catch (error) {
    console.log(error);
    return []; // return empty arra to prevent erroy on subCatories page
  }
}

export async function getSubCategory(_id: mongoose.Types.ObjectId) {
  const response = await axios.get<
    SubCategoryData,
    { data: { subCategory: SubCategoryData } }
  >(`/subCategories/${_id}`);
  return response.data.subCategory;
}

export async function deleteSubCategory(_id: mongoose.Types.ObjectId) {
  await axios.delete(`/subCategories/${_id}`);
  return null;
}
