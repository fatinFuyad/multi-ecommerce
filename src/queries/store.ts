import { StoreFormSchemaType } from "@/lib/schemas";
import { StoreDoc } from "@/models/Store";
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
 * @description Use for updating store document
 */
export async function updateStore(_id: Types.ObjectId, data: StoreFormSchemaType) {
  return updateDoc<{ store: StoreDoc }>(`/stores/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteStore(_id: Types.ObjectId) {
  return deleteDoc<{ store: null }>(`/stores/${_id}`);
}

/**
 * @description Use for api req creating or updating store
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertStore(data: StoreFormSchemaType) {
  return upsertDoc<{ store: StoreDoc }>("/stores", data);
}

export async function createStore(data: StoreFormSchemaType) {
  return createDoc<{ store: StoreDoc }>("/stores", data);
}

export async function getStores<T = StoreDoc>(query?: string, options?: ApiQueryOptions) {
  return getDocs<{ stores: T[] }>("/stores" + (query ? `?${query}` : ""), options);
}

export async function getStoreById<T = StoreDoc>(
  _id: Types.ObjectId,
  query?: string,
  options?: ApiQueryOptions
) {
  return getDocById<{ store: T }>(`/stores/${_id}` + (query ? `?${query}` : ""), options);
}
