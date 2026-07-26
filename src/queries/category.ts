import { CategoryFormSchemaType } from "@/lib/schemas";
import { CategoryDoc } from "@/models/Category";
import { Types } from "mongoose";
import {
  ApiQueryOptions,
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
export async function updateCategory(_id: Types.ObjectId, data: CategoryFormSchemaType) {
  return updateDoc<{ category: CategoryDoc }>(`/categories/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteCategory(_id: Types.ObjectId) {
  return deleteDoc<{ category: null }>(`/categories/${_id}`);
}

/**
 * @description Use for api req creating or updating category
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertCategory(data: CategoryFormSchemaType) {
  return upsertDoc<{ category: CategoryDoc }>("/categories", data);
}

export async function createCategory(data: CategoryFormSchemaType) {
  return createDoc<{ category: CategoryDoc }>("/categories", data);
}

export async function getCategories<T = CategoryDoc>(
  query?: string,
  options?: ApiQueryOptions
) {
  return getDocs<{ categories: T[] }>(
    "/categories" + (query ? `?${query}` : ""),
    options
  );
}

export async function getCategoryById<T = CategoryDoc>(
  _id: Types.ObjectId,
  query?: string,
  options?: ApiQueryOptions
) {
  return getDocById<{ category: T }>(
    `/categories/${_id}` + (query ? `?${query}` : ""),
    options
  );
}
