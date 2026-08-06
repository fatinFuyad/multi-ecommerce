import {
  ShippingRateFormSchemaType,
  StoreFormSchemaType,
  StoreShippingFormSchemaType
} from "@/lib/schemas";
import { IStore } from "@/models/Store";
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
import { CountryWithShippingRatesType } from "@/lib/types";
import { IShippingRate } from "@/models/Shipping-Rate";

/**
 * @description Use for updating store document
 */
export async function updateStore(
  _id: Types.ObjectId | string,
  data: StoreFormSchemaType
) {
  return updateDoc<{ store: IStore }>(`/stores/${_id}`, data);
}

/**
 * @description Use for updating store shipping details
 */
export async function updateStoreShipping(
  _id: Types.ObjectId | string,
  data: StoreShippingFormSchemaType
) {
  return updateDoc<{ store: IStore }>(`/stores/${_id}/store-shipping`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteStore(_id: Types.ObjectId | string) {
  return deleteDoc<{ store: null }>(`/stores/${_id}`);
}

/**
 * @description Use for api req creating or updating store
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertStore(data: StoreFormSchemaType) {
  return upsertDoc<{ store: IStore }>("/stores", data);
}

export async function createStore(data: StoreFormSchemaType) {
  return createDoc<{ store: IStore }>("/stores", data);
}

export async function getStores<T = IStore>(query?: string, options?: ApiQueryHeaders) {
  return getDocs<{ stores: T[] }>("/stores" + (query ? `?${query}` : ""), options);
}

export async function getStoreById<T = IStore>(
  _id: Types.ObjectId | string,
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocById<{ store: T }>(`/stores/${_id}` + (query ? `?${query}` : ""), options);
}

export async function getShippingRates<T = CountryWithShippingRatesType>(
  storeId: Types.ObjectId | string,
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocById<{ shippingRates: T[] }>(
    `/stores/${storeId}/shipping-rates` + (query ? `?${query}` : ""),
    options
  );
}

export async function upsertShippingRate(
  storeId: Types.ObjectId | string,
  data: ShippingRateFormSchemaType
) {
  return upsertDoc<{ shippingRate: IShippingRate }>(
    `/stores/${storeId}/shipping-rates`,
    data
  );
}
