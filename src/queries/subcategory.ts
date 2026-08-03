import { SubcategoryFormSchemaType } from "@/lib/schemas";
import { ISubcategory } from "@/models/Subcategory";
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
 * @description Use for updating subcategory document
 */
export async function updateSubcategory(
  _id: Types.ObjectId | string,
  data: SubcategoryFormSchemaType
) {
  return updateDoc<{ subcategory: ISubcategory }>(`/subcategories/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteSubcategory(_id: Types.ObjectId | string) {
  return deleteDoc<{ subcategory: null }>(`/subcategories/${_id}`);
}

/**
 * @description Use for api req creating or updating subcategory
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertSubcategory(data: SubcategoryFormSchemaType) {
  return upsertDoc<{ subcategory: ISubcategory }>("/subcategories", data);
}

export async function createSubcategory(data: SubcategoryFormSchemaType) {
  return createDoc<{ subcategory: ISubcategory }>("/subcategories", data);
}

export async function getSubcategories<T = ISubcategory>(
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocs<{ subcategories: T[] }>(
    "/subcategories" + (query ? `?${query}` : ""),
    options
  );
}

export async function getSubcategoryById<T = ISubcategory>(
  _id: Types.ObjectId | string,
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocById<{ subcategory: T }>(
    `/subcategories/${_id}` + (query ? `?${query}` : ""),
    options
  );
}
