"use server";

import { auth } from "@/lib/auth";
import Store, { IStore, StoreFollower, StoreSchema } from "@/models/Store";

/**
 * @name followStore
 * @description - Toggle follow status for a store by the current user.
 *              - If the user is not following the store, it follows the store.
 *              - If the user is already following the store, it unfollows the store.
 * @access User
 * @param storeId - The ID of the store to be followed/unfollowed.
 * @param followID - string
 * @returns `string | null` - Returns ID if the user is now following the store otherwise null.
 */
export const followStore = async (
  storeId: string,
  followId: string | null
): Promise<{ _id: string | null }> => {
  // ): Promise<string | null> => {
  // Get the currently authenticated user
  const { user } = await auth();

  // Check if the store exists
  const store = await Store.findById(storeId)
    .select({ _id: 1, followers: 1 } as {
      [k in keyof IStore]: 1;
    })
    .lean<Pick<StoreSchema, "_id" | "followers">>();

  if (!store) throw new Error("Store not found.");

  if (!followId) {
    const followDoc = await StoreFollower.create({
      store: storeId,
      user: user._id
    });
    await Store.findByIdAndUpdate(store._id, {
      followers: store.followers + 1
    }).lean();

    if (followDoc) return { _id: followDoc._id.toString() }; // cannot pass class|null to client
  }

  // unfollow if already following the store
  if (followId) {
    await StoreFollower.findByIdAndDelete(followId);
    await Store.findByIdAndUpdate(store._id, {
      followers: store.followers - 1
    }).lean();
  }
  return { _id: null };
};

/**
 * @description Checks the following status of the store for user
 * @param storeId - The ID of the store
 * @param userId - The ID of the user
 * @returns `string|null` - The ID of the follow doc or null
 */
export const checkUserFollowingStore = async (
  storeId: string,
  userId: string
): Promise<{ _id: string | null }> => {
  // ): Promise<string | null> => {
  const followDoc = await StoreFollower.findOne({
    store: storeId,
    user: userId
  }).select("_id");

  if (followDoc) return { _id: followDoc._id.toString() };
  return { _id: null };
};
