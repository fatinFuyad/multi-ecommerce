"use server";

import { auth, authenticate } from "@/lib/auth";
import { CartProductType } from "@/lib/types";
import {
  Cart,
  CartItemRawSchema,
  CartRawSchema,
  cartSchema,
  ICart
} from "@/models/Order";
import Product from "@/models/Product";
import Store, { IStore, StoreFollower, StoreSchema } from "@/models/Store";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { getShippingDetails } from "./product";
import { Types } from "mongoose";

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

/**
 * @function saveUserCart
 * @description Saves the user's cart by validating product data from the database and ensuring no frontend manipulation.
 * @access Permission Level - User who owns the cart
 * @param cartProducts An array of product objects from the frontend cart.
 * @returns object - containing the updated cart with recalculated total price and validated product data.
 */
export const saveUserCart = async (cartProducts: CartProductType[]) => {
  // const user = await restrictTo("USER");
  const user = await authenticate();

  const userId = user._id;

  // Search for existing user cart
  const userCart = await Cart.findOne({
    user: user._id
  });

  // Delete any existing user cart
  if (userCart) {
    await Cart.findByIdAndDelete(userCart._id);
  }

  // Fetch product, variant, and size data from the database for validation
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;
      // console.log("cart products", cartProducts);
      // Fetch the product, variant, and size from the database
      const product = await Product.findOne({
        _id: productId
      })
        .populate({ path: "store" })
        .populate({ path: "variants", match: { _id: variantId } })
        .populate({ path: "freeShipping" });
      console.log("user cart", product);

      if (
        !product ||
        product.variants.length === 0 ||
        product.variants[0].sizes.length === 0
      ) {
        throw new Error(
          `Invalid product, variant, or size combination for productId: ${productId}, variantId: ${variantId}, sizeId: ${sizeId}`
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes[0];

      // Validate stock and price
      const validQuantity = Math.min(quantity, size.quantity);

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      // Calculate Shipping details
      const countryCookie = getCookie("userCountry", { cookies });

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false
      };

      if (countryCookie) {
        const country = JSON.parse(countryCookie);
        const tempDetails = await getShippingDetails(
          product.shippingFeeMethod,
          country,
          product.store,
          product.freeShipping
        );
        if (tempDetails) {
          details = tempDetails;
        }
      }
      let shippingFee = 0;
      const { shippingFeeMethod } = product;
      if (shippingFeeMethod === "ITEM") {
        shippingFee =
          quantity === 1
            ? details.shippingFee
            : details.shippingFee + details.extraShippingFee * (quantity - 1);
      } else if (shippingFeeMethod === "WEIGHT") {
        shippingFee = details.shippingFee * variant.weight * quantity;
      } else if (shippingFeeMethod === "FIXED") {
        shippingFee = details.shippingFee;
      }

      const totalPrice = price * validQuantity + shippingFee;
      return {
        productId,
        variantId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        sizeId,
        storeId: product.storeId,
        sku: variant.sku,
        name: `${product.name} · ${variant.variantName}`,
        image: variant.images[0].url,
        size: size.size,
        quantity: validQuantity,
        price,
        shippingFee,
        totalPrice
      };
    })
  );

  // Recalculate the cart's total price and shipping fees
  const subTotal = validatedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingFees = validatedCartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0
  );

  const total = subTotal + shippingFees;
  // console.log({ shippingFees, subTotal, total });

  // Save the validated items to the cart in the database
  const cartItems = validatedCartItems.map((item) => {
    return {
      product: new Types.ObjectId(item.productId),
      variant: new Types.ObjectId(item.variantId),
      size: new Types.ObjectId(item.sizeId),
      store: new Types.ObjectId(item.storeId),
      sku: item.sku,
      productSlug: item.productSlug,
      variantSlug: item.variantSlug,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      productSize: item.size,
      price: item.price,
      shippingFee: item.shippingFee,
      totalPrice: item.totalPrice
    } satisfies CartItemRawSchema;
  });

  const cart = await Cart.create({
    cartItems: cartItems as Types.DocumentArray<any>,
    shippingFees,
    subTotal,
    total,
    user: new Types.ObjectId(userId)
  } satisfies CartRawSchema);

  return JSON.parse(JSON.stringify(cart)) as ICart;
};
