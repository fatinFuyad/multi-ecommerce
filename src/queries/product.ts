import axios from "@/lib/axios";
import { ProductFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import { IProduct, ProductDoc, ProductVariantDoc } from "@/models/Product";
import { MergeType, Types } from "mongoose";

// type ApiQueryOptions = Record<'lean'|'populate'|'limitPopulateDoc'|'fields', boolean|string|string[]>
export type ApiQueryOptions = {
  lean?: boolean;
  populate?: string;
  limitPopulateDoc?: number;
  fields: string;
};

/**
 * @description Use for updating product document
 */
export async function updateProduct(_id: Types.ObjectId, data: ProductFormSchemaType) {
  const response = await axios.patch<ApiResponse<{ product: ProductDoc }>>(
    `/products/${_id}`,
    data
  );
  return response.data;
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteProduct(_id: Types.ObjectId) {
  const response = await axios.delete<ApiResponse<{ product: null }>>(`/products/${_id}`);
  return response.data;
}

/**
 * @description Use for api req creating or updating product & productVariant document
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertProduct(
  data: ProductFormSchemaType & { productId?: Types.ObjectId; storeUrl: string }
) {
  const response = await axios.post<
    ApiResponse<{ product: ProductDoc; productVariant: ProductVariantDoc }>
  >(`/products`, data);
  return response.data;
}

/**
 * @name options
 * @param {string} query - the url with query to get specific documents from database.
 * @example: `/products?category=492ad&price[lte]=400`
 * @param {Object|undefined} options - The options for how to excecute the query and return documents.
 * @property `options.lean`- if need a plain object instead of mongoose hydrated documnet.
 * @property `options.populate` - name of the referenced fields in a document.
 * @property `limitPopulateDoc` - limit the number of refeneced docs to be populated from the referenced array that contains doc's _id
 * @returns `Promise<ApiResponse>` - document[]
 */
export async function getAllProducts(
  query: string,
  options?: ApiQueryOptions & {
    populate?: ("category" | "subcategory" | "store" | "variants")[];
    fields?: readonly (keyof IProduct)[];
  }
) {
  const { lean = false, populate = [], limitPopulateDoc = 10 } = options || {};

  const response = await axios.get<ApiResponse<{ products: ProductDoc[] }>>(
    `/products?${query}`,
    {
      headers: { lean, populate, limitPopulateDoc }
    }
  );
  return response.data;
}

export async function getProductById<T = ProductDoc>(
  _id: Types.ObjectId | string,
  options?: MergeType<
    ApiQueryOptions,
    {
      populate?: ("category" | "subcategory" | "store" | "variants")[];
      fields?: readonly (keyof IProduct)[];
    }
  >
) {
  const { lean = false, populate, limitPopulateDoc } = options || {};
  try {
    // Malformed url can cause AxiosError: Request failed with status code 404
    // also if the associated route is not created to send proper response
    const reqUrl =
      `/products/${_id}` +
      (options?.fields ? `?fields=${options?.fields?.join(",")}` : "");
    console.log(reqUrl);
    const response = await axios.get<ApiResponse<{ product: T }>>(reqUrl, {
      headers: { lean, populate: populate?.join(","), limitPopulateDoc }
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    return { product: null, message: error?.message, error };
  }
}

/////////////////
// GENERALIZED FUNCTIONS FOR API REQUESTS

/**
 * @name getAllDoc
 * @param {string} queryUrl - the url with query to get specific documents from database.
 * example: `/products?category=492ad&price[lte]=400`
 * @param {Object|undefined} options - The options for how to excecute the query and return documents.
 * `options.lean`- if need a plain object instead of mongoose hydrated documnet.
 * `options.populate` - name of the referenced fields in a document.
 * `limitPopulateDoc` - limit the number of refeneced docs to be populated from the referenced array that contains doc's _id
 * @returns `Promise<ApiResponse>` - document[]
 */
export async function getAllDoc<T>(
  queryUrl: string,
  options?: {
    lean?: boolean;
    populate?: string[];
    limitPopulateDoc?: number;
  }
) {
  const { lean = false, populate = [], limitPopulateDoc = 10 } = options || {};

  const response = await axios.get<ApiResponse<T>>(queryUrl, {
    headers: { lean, populate, limitPopulateDoc }
  });
  return response.data;
}

/**
 * @description Get a specific document by it's _id
 * @param route
 * @param _id
 * @param options - The options for how to excecute the query and return document. 
   @property `options.lean` - if need a plain object instead of mongoose hydrated documnet
   @property `options.populate` - name of the referenced fields in a document
   @property `options.limitPopulateDoc` - limit the number of refeneced docs to be populated from the referenced array that contains doc's _id 
 * @returns `Promise<ApiResponse>` - document
 */

export async function getDocById<T>(
  route: string,
  _id: Types.ObjectId,
  options?: {
    lean?: boolean;
    populate?: string[];
    limitPopulateDoc?: number;
  }
) {
  const { lean = false, populate = [], limitPopulateDoc = 10 } = options || {};

  const response = await axios.get<ApiResponse<T>>(`/${route}/${_id}`, {
    headers: { lean, populate, limitPopulateDoc }
  });
  return response.data;
}

/**
 * @description Creates upsert operation. Use for creating or updating document
 * @param route - The api url for the upsert operation
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertDoc<ResType, DataType>(route: string, data: DataType) {
  const response = await axios.post<ApiResponse<ResType>>(route, data);
  return response.data;
}

/**
 * @description Creates update operation. Use for updating document
 * @param route - The api url for the update operation
 * @param _id - The _id of the document
 * @param data - The data to be updated
 * @returns `Promise<ApiResponse>` - updated document
 */
export async function updateDoc<ResType, DataType>(
  route: string,
  _id: Types.ObjectId,
  data: DataType
) {
  const response = await axios.patch<ApiResponse<ResType>>(`${route}/${_id}`, data);
  return response.data;
}

/**
 * @description Creates delete operation. Use for deleting document
 * @param route - The api url for the delete operation
 * @param _id - The _id of the document
 * @returns `Promise<ApiResponse>` - null
 */
export async function deleteDoc<T>(route: string, _id: Types.ObjectId) {
  const response = await axios.delete<ApiResponse<T>>(`${route}/${_id}`);
  return response.data;
}
