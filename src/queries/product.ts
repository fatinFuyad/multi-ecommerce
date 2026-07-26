import { ProductFormSchemaType } from "@/lib/schemas";
import { ProductDoc, ProductVariantDoc } from "@/models/Product";
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
 * @description Use for updating product document
 */
export async function updateProduct(_id: Types.ObjectId, data: ProductFormSchemaType) {
  return updateDoc<{ product: ProductDoc }>(`/products/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export const deleteProduct = async (_id: Types.ObjectId) => {
  return deleteDoc<{ product: null }>(`/products/${_id}`);
};

/**
 * @description Use for api req creating or updating product & productVariant document
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertProduct(
  data: ProductFormSchemaType & { productId?: Types.ObjectId; storeUrl: string }
) {
  return upsertDoc<{ product: ProductDoc; productVariant: ProductVariantDoc }>(
    "/products",
    data
  );
}

export async function createProduct(data: ProductFormSchemaType) {
  return createDoc<{ product: ProductDoc; productVariant: ProductVariantDoc }>(
    "/products",
    data
  );
}

export async function getProducts<T = ProductDoc>(
  query?: string,
  options?: ApiQueryOptions
) {
  return getDocs<{ products: T[] }>("/products" + (query ? `?${query}` : ""), options);
}

export async function getProductById<T = ProductDoc>(
  _id: Types.ObjectId,
  query?: string,
  options?: ApiQueryOptions
) {
  return getDocById<{ product: T }>(
    `/products/${_id}` + (query ? `?${query}` : ""),
    options
  );
}
