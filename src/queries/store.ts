import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { StoreDoc } from "@/models/Store";

export async function getStore({
  findBy,
  value
}: {
  findBy: "_id" | "name" | "email" | "url";
  value: string;
}) {
  const response = await axios.get<ApiResponse<{ store: StoreDoc }>>(
    `/stores?${findBy}=${value}`,
    {
      headers: { query: findBy }
    }
  );
  return response.data.store;
}

export async function getStores() {
  const response =
    await axios.get<ApiResponse<{ stores: StoreDoc[] }>>("/stores");
  return response.data.stores;
}
