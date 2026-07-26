import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";

/////////////////
// GENERALIZED FUNCTIONS FOR API REQUESTS

type PopulateFields =
  | "category"
  | "categories"
  | "subcategory"
  | "subcategories"
  | "store"
  | "stores"
  | "product"
  | "products"
  | "variants"
  | "prodcutVariants";

export type ApiQueryOptions = {
  lean?: boolean;
  populate?: PopulateFields[];
  limitPopulateDoc?: number;
};

/**
 * @name getDocs
 * @description get specific documents from database according to the query.
 * @param {string} queryUrl - the url with query
 * example: `/products?category=492ad&price[lte]=400`
 * @param {Object|undefined} options - The options for how to excecute the query and return documents.
 * `options.lean`- if need a plain object instead of mongoose hydrated documnet.
 * `options.populate` - name of the referenced fields in a document.
 * `limitPopulateDoc` - limit the number of refeneced docs to be populated from the referenced array that contains doc's _id
 * @returns `Promise<ApiResponse>` -> doc[]
 */
export async function getDocs<T = any>(
  queryUrl: string,
  options?: ApiQueryOptions
): Promise<ApiResponse<T>> {
  const { lean, populate, limitPopulateDoc } = options || {};

  const response = await axios.get<ApiResponse<T>>(queryUrl, {
    headers: { lean, populate: populate?.join(","), limitPopulateDoc }
  });
  return response.data;
}

/**
 * @description Get a specific document by it's _id
 * @param routeUrl - The api url for the get operation
 * @example /products/id049d4
 * @param options - The options for how to excecute the query and return document.
 * @returns `Promise<ApiResponse>` -> document
 */
export async function getDocById<T = any>(
  routeUrl: string,
  options?: ApiQueryOptions
): Promise<ApiResponse<T>> {
  const { lean, populate, limitPopulateDoc } = options || {};

  const response = await axios.get<ApiResponse<T>>(routeUrl, {
    headers: { lean, populate: populate?.join(","), limitPopulateDoc }
  });
  return response.data;
}

/**
 * @description Creates upsert operation. Use for creating or updating document
 * @param routeUrl - The api url for the update operation
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` -> upserted document
 */
export async function upsertDoc<ResType = any, DataType = any>(
  routeUrl: string,
  data: DataType
): Promise<ApiResponse<ResType>> {
  const response = await axios.post<ApiResponse<ResType>>(routeUrl, data);
  return response.data;
}

/**
 * @description Creates update operation. Use for updating document
 * @param routeUrl - The api url for the update operation
 * @example /products/id049d4
 * @param data - The data to be updated
 * @returns `Promise<ApiResponse>` -> updated document
 */
export async function updateDoc<ResType = any, DataType = any>(
  routeUrl: string,
  data: DataType
): Promise<ApiResponse<ResType>> {
  const response = await axios.patch<ApiResponse<ResType>>(routeUrl, data);
  return response.data;
}

/**
 * @description Creates delete operation. Use for deleting document
 * @param routeUrl - The api url for the delete operation
 * @example /products/id049d4
 * @returns `Promise<ApiResponse>` -> null
 */
export async function deleteDoc<T = any>(routeUrl: string): Promise<ApiResponse<T>> {
  const response = await axios.delete<ApiResponse<T>>(routeUrl);
  return response.data;
}
