import axios from "@/lib/axios";
import { StoreFormSchema } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import { IStore, StoreData } from "@/models/Store";
import { Types } from "mongoose";
import z from "zod";

export async function createStore(
  store: z.infer<typeof StoreFormSchema>
): Promise<ApiResponse<StoreData>> {
  console.log("request sending");
  const response = await axios.post("/store", store);
  return response.data;
}

export async function updateStore(
  _id: Types.ObjectId,
  store: Partial<z.infer<typeof StoreFormSchema>>
): Promise<ApiResponse<StoreData>> {
  const response = await axios.patch(`/store/${_id}`, store);
  return response.data;
}

export async function getStore(_id: Types.ObjectId) {
  const response = await axios.get<ApiResponse<StoreData>>(`/store${_id}`);
  return response.data.data;
}

export async function getStores(store: IStore) {
  const response = await axios.get<ApiResponse<StoreData[]>>("/store");
  return response.data.data;
}
