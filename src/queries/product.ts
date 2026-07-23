import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { ProductDoc } from "@/models/Product";
import { Types } from "mongoose";

export async function getProducts() {
  const response = await axios.get<ApiResponse<{ product: ProductDoc }>>("/products");
  return response.data.product;
}

export async function getData<T>(
  route: string,
  query: string,
  options?: Record<string, any>
) {
  let queryUrl = `/${route}`;
  if (query) {
    queryUrl += "?" + query;
  }
  const response = await axios.get<ApiResponse<T>>(queryUrl);
  return response.data;
}

export async function getDataById<T>(
  route: string,
  id: Types.ObjectId | string,
  options?: Record<string, any>
) {
  const response = await axios.get<ApiResponse<T>>(`/${route}/${id}`);
  return response.data;
}

export async function upsertProductReq<ResType, DataType = any>(
  url: string,
  data: DataType
  // options?: { populate?: string; lean?: string }
) {
  const response = await axios.post<ApiResponse<ResType>>(url, data);
  return response.data;
}
