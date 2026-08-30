import { ProductFormSchemaType } from "@/lib/schemas";
import { ProductWithVariant } from "@/lib/types";
import { IProduct, IProductVariant } from "@/models/Product";
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
 * @description Use for updating product document
 */
export async function updateProduct(
  _id: Types.ObjectId | string,
  data: ProductFormSchemaType
) {
  return updateDoc<{ product: IProduct }>(`/products/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export const deleteProduct = async (_id: Types.ObjectId | string) => {
  return deleteDoc<{ product: null }>(`/products/${_id}`);
};

/**
 * @description Use for api req creating or updating product & productVariant document
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertProduct(data: ProductFormSchemaType) {
  return upsertDoc<{ product: ProductWithVariant }>("/products", data);
}

export async function createProduct(data: ProductFormSchemaType) {
  return createDoc<{ product: ProductWithVariant }>("/products", data);
}

export async function getProducts<T = IProduct>(
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocs<{ products: T[] }>("/products" + (query ? `?${query}` : ""), options);
}

export async function getProductById<T = IProduct>(
  _id: Types.ObjectId | string,
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocById<{ product: T }>(
    `/products/${_id}` + (query ? `?${query}` : ""),
    options
  );
}

// get product variants with query

export async function getProductVariants<T = IProductVariant>(
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocs<{ variants: T[] }>(
    query ? `/products/variants?${query}` : "/products/variants",
    options
  );
}
