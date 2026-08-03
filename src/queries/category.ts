import { CategoryFormSchemaType } from "@/lib/schemas";
import { ICategory } from "@/models/Category";
import { Types } from "mongoose";
import {
  ApiQueryHeaders,
  createDoc,
  deleteDoc,
  getDocById,
  getDocs,
  updateDoc,
  upsertDoc
} from "./api-query";

/**
 * @description Use for updating category document
 */
export async function updateCategory(
  _id: Types.ObjectId | string,
  data: CategoryFormSchemaType
) {
  return updateDoc<{ category: ICategory }>(`/categories/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteCategory(_id: Types.ObjectId | string) {
  return deleteDoc<{ category: null }>(`/categories/${_id}`);
}

/**
 * @description Use for api req creating or updating category
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertCategory(data: CategoryFormSchemaType) {
  return upsertDoc<{ category: ICategory }>("/categories", data);
}

export async function createCategory(data: CategoryFormSchemaType) {
  return createDoc<{ category: ICategory }>("/categories", data);
}

export async function getCategories<T = ICategory>(
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocs<{ categories: T[] }>(
    "/categories" + (query ? `?${query}` : ""),
    options
  );
}

export async function getCategoryById<T = ICategory>(
  _id: Types.ObjectId | string,
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocById<{ category: T }>(
    `/categories/${_id}` + (query ? `?${query}` : ""),
    options
  );
}
