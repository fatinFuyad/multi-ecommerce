import { IOfferTag } from "@/models/OfferTag";
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
 * @description Use for api req creating or updating offerTag
 * @param data - The data to be upserted
 * @returns `Promise<ApiResponse>` - upserted document
 */
export async function upsertOfferTag(data: any) {
  return upsertDoc<{ offerTag: IOfferTag }>("/offer-tags", data);
}

export async function createOfferTag(data: any) {
  return createDoc<{ offerTag: IOfferTag }>("/offer-tags", data);
}

/**
 * @description Use for updating offerTag document
 */
export async function updateOfferTag(_id: Types.ObjectId | string, data: any) {
  return updateDoc<{ offerTag: IOfferTag }>(`/offer-tags/${_id}`, data);
}

/**
 * @description Creates delete operation. Use for deleting document
 */
export async function deleteOfferTag(_id: Types.ObjectId | string) {
  return deleteDoc<{ offerTag: null }>(`/offer-tags/${_id}`);
}

export async function getOfferTags<T = IOfferTag>(
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocs<{ offerTags: T[] }>("/offer-tags" + (query ? `?${query}` : ""), options);
}

export async function getOfferTagById<T = IOfferTag>(
  _id: Types.ObjectId | string,
  query?: string,
  options?: ApiQueryHeaders
) {
  return getDocById<{ offerTag: T }>(
    `/offer-tags/${_id}` + (query ? `?${query}` : ""),
    options
  );
}
