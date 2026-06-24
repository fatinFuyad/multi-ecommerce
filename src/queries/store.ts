import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { StoreData } from "@/models/Store";
import { Types } from "mongoose";

export async function getStore(_id: Types.ObjectId) {
  const response = await axios.get<ApiResponse<{ store: StoreData }>>(
    `/stores${_id}`
  );
  return response.data.store;
}

export async function getStores() {
  const response =
    await axios.get<ApiResponse<{ stores: StoreData[] }>>("/stores");
  return response.data.stores;
}
