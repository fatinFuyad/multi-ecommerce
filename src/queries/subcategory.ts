import { SubcategoryFormSchemaType } from "@/lib/schemas";
import { SubcategoryDoc } from "@/models/Subcategory";
import { Types } from "mongoose";
import {
  ApiQueryOptions,
  deleteDoc,
  getDocById,
  getDocs,
  updateDoc,
  upsertDoc
} from "./api-query";

/**
 * @description Use for updating subcategory document
 */
export async function updateSubcategory(
  _id: Types.ObjectId,
  data: SubcategoryFormSchemaType
) {
  return updateDoc<{ subcategory: SubcategoryDoc }>(`/subcategories/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteSubcategory(_id: Types.ObjectId) {
  return deleteDoc<{ subcategory: null }>(`/subcategories/${_id}`);
}

/**
 * @description Use for api req creating or updating subcategory
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertSubcategory(data: SubcategoryFormSchemaType) {
  return upsertDoc<{ subcategory: SubcategoryDoc }>("/subcategories", data);
}

export async function getSubcategories<T = SubcategoryDoc>(
  query?: string,
  options?: ApiQueryOptions
) {
  return getDocs<{ subcategories: T[] }>(
    "/subcategories" + (query ? `?${query}` : ""),
    options
  );
}

export async function getSubcategoryById<T = SubcategoryDoc>(
  _id: Types.ObjectId,
  query?: string,
  options?: ApiQueryOptions
) {
  return getDocById<{ subcategory: T }>(
    `/subcategories/${_id}` + (query ? `?${query}` : ""),
    options
  );
}
