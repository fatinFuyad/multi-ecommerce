import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { SubcategoryDoc } from "@/models/Subcategory";
import mongoose from "mongoose";

export async function getAllSubcategories<DataType>(option?: {
  populate: "category";
}): Promise<DataType[]> {
  try {
    let response;

    // if the option has populate then we add a custom property and based on that the api will return the populated or unpopulated data
    if (option?.populate) {
      response = await axios.get<ApiResponse<{ subcategories: DataType[] }>>(
        "/subcategories",
        {
          headers: { Populate: "category" }
        }
      );
    } else {
      response =
        await axios.get<ApiResponse<{ subcategories: DataType[] }>>(
          "/subcategories"
        );
    }

    return response.data.subcategories;
  } catch (error) {
    console.log(error);
    return []; // return empty arra to prevent erroy on subCatories page
  }
}

export async function getSubcategory(_id: mongoose.Types.ObjectId) {
  const response = await axios.get<
    SubcategoryDoc,
    { data: { subcategory: SubcategoryDoc } }
  >(`/subcategories/${_id}`);
  return response.data.subcategory;
}

export async function deleteSubcategory(_id: mongoose.Types.ObjectId) {
  await axios.delete(`/subcategories/${_id}`);
  return null;
}
