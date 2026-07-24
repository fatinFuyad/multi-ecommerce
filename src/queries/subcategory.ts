import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { SubcategoryDoc } from "@/models/Subcategory";
import mongoose from "mongoose";

export async function getAllSubcategories<DataType>(options?: {
  populate?: "category";
  query: string; // e.g: "category=id&price[lte]=1000"
  // query?: Record<string, string | number | string[] | undefined>;
}): Promise<DataType[]> {
  try {
    // if the options has populate then we add a custom header and based on that the api will return the populated or unpopulated data
    const queryUrl = `/subcategories` + (options?.query ? `?${options?.query}` : "");

    console.log({ queryUrl });
    const response = await axios.get<ApiResponse<{ subcategories: DataType[] }>>(
      // `/subcategories${options?.query ? `?${options.query}` : ""}`,
      queryUrl,
      {
        headers: {
          populate: options?.populate
        }
      }
    );
    return response.data.subcategories;
  } catch (error) {
    console.log(error);
    return []; // return empty arra to prevent erroy on subCatories page
  }
}

export async function getSubcategory(_id: mongoose.Types.ObjectId) {
  const response = await axios.get<ApiResponse<{ subcategory: SubcategoryDoc }>>(
    `/subcategories/${_id}`
  );
  return response.data.subcategory;
}

export async function deleteSubcategory(_id: mongoose.Types.ObjectId) {
  await axios.delete(`/subcategories/${_id}`);
  return null;
}
