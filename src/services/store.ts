"use server";

import { restrictTo } from "@/lib/api-utils";
import { dbConnect } from "@/lib/db-connect";
import { PopulateQueryOptions, QueryBuilder, QueryParams } from "@/lib/query-builder";
import { StoreFormSchemaType, StoreShippingFormSchemaType } from "@/lib/schemas";
import Store, { IStore, StoreDoc, StoreRawSchema } from "@/models/Store";
import User from "@/models/User";
import { Types } from "mongoose";

/**
 * @description Upserts store details into the database, ensuring uniqueness of name,url, email, and phone number.
 * @access Seller Only
 * @param store Partial store object containing details of the store to be upserted.
 * @returns: Updated or newly created store details.
 */
export async function upsertStore(storeFormData: StoreFormSchemaType) {
  const isUpddateSession = Boolean(storeFormData._id);

  let store: IStore;

  if (isUpddateSession) {
    store = await updateStore(storeFormData, storeFormData._id!);
  } else {
    store = await createStore(storeFormData);
  }

  return store;
}

export async function createStore(storeFormData: StoreFormSchemaType) {
  const seller = await restrictTo("SELLER");

  if (Object.keys(storeFormData).length === 0)
    throw new Error("Store data should not be empty");

  const storeId = new Types.ObjectId(storeFormData._id);

  // seller need to use unique name, url, email and phone number for each store
  const existingStore = await Store.findOne({
    $or: [
      { name: storeFormData.name },
      { url: storeFormData.url },
      { email: storeFormData.email },
      { phone: storeFormData.phone }
    ]
    // $nor: [{ _id: storeId }] // as we are not updating here
  });

  // Throw error if store with same name or URL already exists
  if (existingStore) {
    let errorMessage = "";
    if (existingStore.name === storeFormData.name) {
      errorMessage = "A store with the same name already exists";
    } else if (existingStore.email === storeFormData.email) {
      errorMessage = "A store with the same email already exists";
    } else if (existingStore.phone === storeFormData.phone) {
      errorMessage = "A store with the same phone number already exists";
    } else if (existingStore.url === storeFormData.url) {
      errorMessage = "A store with the same URL already exists";
    }
    throw new Error(errorMessage);
  }

  const storeData = {
    ...storeFormData,
    _id: storeId,
    logo: storeFormData.logo[0].url,
    cover: storeFormData.logo[0].url,
    user: new Types.ObjectId(seller._id)
  } satisfies StoreRawSchema;

  const newStore: StoreDoc = await Store.create(storeData);

  // After creating store update seller data;
  await User.findByIdAndUpdate(seller._id, {
    $push: { stores: newStore._id }
  });

  return JSON.parse(JSON.stringify(newStore)) as IStore;
}

export async function updateStore(storeFormData: StoreFormSchemaType, storeId: string) {
  await restrictTo("SELLER");

  if (Object.keys(storeFormData).length === 0)
    throw new Error("Store data should not be empty");

  // seller need to use unique name, url, email and phone number for each store
  const existingStore = await Store.findOne({
    $or: [
      { name: storeFormData.name },
      { url: storeFormData.url },
      { email: storeFormData.email },
      { phone: storeFormData.phone }
    ],
    $nor: [{ _id: storeId }] // ignore this store while updating
  });

  // Throw error if store with same name or URL already exists
  if (existingStore) {
    let errorMessage = "";
    if (existingStore.name === storeFormData.name) {
      errorMessage = "A store with the same name already exists";
    } else if (existingStore.email === storeFormData.email) {
      errorMessage = "A store with the same email already exists";
    } else if (existingStore.phone === storeFormData.phone) {
      errorMessage = "A store with the same phone number already exists";
    } else if (existingStore.url === storeFormData.url) {
      errorMessage = "A store with the same URL already exists";
    }
    throw new Error(errorMessage);
  }
  const updatedStore = await Store.findByIdAndUpdate(
    storeId,
    {
      ...storeFormData,
      logo: storeFormData.logo[0].url,
      cover: storeFormData.logo[0].url
    } satisfies Partial<IStore>,
    { new: true }
  );
  if (!updateStore) throw new Error("Invalid ID or the store doesn't exists");
  return JSON.parse(JSON.stringify(updatedStore)) as IStore;
}

export async function getStores<T = IStore>(
  queryItem: Record<string, any>,
  populateOptions: PopulateQueryOptions = {}
) {
  await dbConnect(); // connect to database

  const query = new QueryBuilder(Store.find().lean(), queryItem)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .populateDoc(populateOptions)
    .build();

  const stores = await query;

  return JSON.parse(JSON.stringify(stores)) as T[];
}

export async function getStoreById<T = IStore>(
  storeId: string,
  queryItem: QueryParams = {},
  queryOptions: PopulateQueryOptions = {}
) {
  await dbConnect(); // connect to database

  const [store] = await new QueryBuilder(Store.find({ _id: storeId }).lean(), queryItem)
    .limitFields()
    .populateDoc(queryOptions)
    .build();

  if (!store) throw new Error("Invalid ID or the store doesn't exists");
  return JSON.parse(JSON.stringify(store)) as T;
}

export async function getStore<T = IStore>(
  queryItem: QueryParams,
  queryOptions: PopulateQueryOptions = {}
) {
  await dbConnect(); // connect to database
  const query = new QueryBuilder(Store.find().lean(), queryItem)
    .filter()
    .limitFields()
    .populateDoc(queryOptions)
    .build();
  const [store] = await query;

  if (!store) throw new Error("No store found with the query!");
  return JSON.parse(JSON.stringify(store)) as T;
}

export async function updateStoreShipping<T = IStore>(
  storeId: string,
  storeShippingData: StoreShippingFormSchemaType
) {
  // authorize seller
  const user = await restrictTo("SELLER");

  if (
    typeof storeShippingData !== "object" ||
    Object.keys(storeShippingData).length === 0
  )
    throw new Error("Store shipping data should not be empty");

  const updatedStore = await Store.findOneAndUpdate<StoreDoc>(
    { _id: storeId, user: user._id },
    {
      ...storeShippingData
    } satisfies Partial<IStore>,
    { new: true }
  );

  if (!updatedStore)
    throw new Error(
      "Make sure you have the permission or ownership of the store to make any changes!"
    );

  return JSON.parse(JSON.stringify(updatedStore)) as T;
}
