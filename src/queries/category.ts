import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { CategoryDoc } from "@/models/Category";
import mongoose from "mongoose";

// make api requests from the frontend for category operations

export async function getAllCategories(): Promise<CategoryDoc[]> {
  try {
    const response =
      await axios.get<ApiResponse<{ categories: CategoryDoc[] }>>(
        "/categories"
      );

    return response.data.categories;
  } catch {
    return [];
  }
}

export async function getCategory(_id: mongoose.Types.ObjectId) {
  const response = await axios.get<ApiResponse<{ category: CategoryDoc }>>(
    `/categories/${_id}`
  );
  return response.data.category;
}

export async function deleteCategory(_id: mongoose.Types.ObjectId) {
  await axios.delete(`/categories/${_id}`);
  return null;
}
