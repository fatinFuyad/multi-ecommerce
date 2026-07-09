import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { SubCategoryDoc } from "@/models/SubCategory";
import mongoose from "mongoose";

export async function getAllSubCategories<DataType>(option?: {
  populate: "category";
}): Promise<DataType[]> {
  try {
    let response;

    // if the option has populate then we add a custom property and based on that the api will return the populated or unpopulated data
    if (option?.populate) {
      response = await axios.get<ApiResponse<{ subCategories: DataType[] }>>(
        "/subCategories",
        {
          headers: { Populate: "category" }
        }
      );
    } else {
      response =
        await axios.get<ApiResponse<{ subCategories: DataType[] }>>(
          "/subCategories"
        );
    }

    return response.data.subCategories;
  } catch (error) {
    console.log(error);
    return []; // return empty arra to prevent erroy on subCatories page
  }
}

export async function getSubCategory(_id: mongoose.Types.ObjectId) {
  const response = await axios.get<
    SubCategoryDoc,
    { data: { subCategory: SubCategoryDoc } }
  >(`/subCategories/${_id}`);
  return response.data.subCategory;
}

export async function deleteSubCategory(_id: mongoose.Types.ObjectId) {
  await axios.delete(`/subCategories/${_id}`);
  return null;
}
