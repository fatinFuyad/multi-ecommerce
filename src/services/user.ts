"use server";

import { auth, authenticate } from "@/lib/auth";
import { dbConnect } from "@/lib/db-connect";
import { QueryBuilder, QueryParams } from "@/lib/query-builder";
import { ShippingAddressSchemaType } from "@/lib/schemas";
import { CartProductType, MergeType } from "@/lib/types";
import {
  Cart,
  CartItemRawSchema,
  CartRawSchema,
  ICart,
  IShippingAddress,
  Order,
  OrderGroup,
  OrderGroupRawSchema,
  OrderGroupSchema,
  OrderItem,
  OrderItemRawSchema,
  OrderItemSchema,
  OrderRawSchema,
  OrderSchema,
  ShippingAddress,
  ShippingAddressRawSchema,
  UserShippingAddressType
} from "@/models/Order";
import Product, { IProduct, IProductVariant } from "@/models/Product";
import {
  Country,
  CountrySchema,
  FreeShippingWithCountries,
  ICountry
} from "@/models/Shipping-Rate";
import Store, { IStore, StoreFollower, StoreSchema } from "@/models/Store";
import { getCookie } from "cookies-next";
import { Types } from "mongoose";
import { cookies } from "next/headers";
import { getDeliveryDetailsForStoreByCountry, getShippingDetails } from "./product";

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
    .select({ _id: 1, followers: 1 } as Record<keyof IStore, 1>)
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
      // console.log("user cart", product);

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

/**
 * @description get a country with based one the query
 */
export async function getCountry(query: Record<string, any>) {
  await dbConnect();
  const country = await Country.findOne(query).lean();

  return JSON.parse(JSON.stringify(country)) as ICountry;
}

export async function getAllCountries<T = ICountry>(queryItem?: QueryParams) {
  await dbConnect(); // connect database
  const query = new QueryBuilder(Country.find().lean(), queryItem || {})
    .filter()
    .sort()
    .limitFields()
    .build();

  const productsData = await query;

  return JSON.parse(JSON.stringify(productsData)) as T[];
}

/**
 * @description Retrieves all shipping addresses for a specific user.
 * @Permission Level: User who owns the addresses
 * @returns List of shipping addresses for the user.
 */
export const getUserShippingAddresses = async () => {
  // authenticate user
  const user = await authenticate();

  // Ensure user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Retrieve all shipping addresses for the specified user
  const shippingAddresses = await ShippingAddress.find({
    user: user._id
  })
    .populate({ path: "country" })
    .lean();

  return JSON.parse(JSON.stringify(shippingAddresses)) as UserShippingAddressType[];
};

export const upsertShippingAddress = async (
  addressFormData: ShippingAddressSchemaType
) => {
  // authenticate user
  const user = await authenticate();

  // Ensure address data is provided
  if (!addressFormData) throw new Error("Please provide address data.");

  const isUpdateSession = Boolean(addressFormData._id);

  // make the previous addresses default false if newsest address has defualt set to true
  if (addressFormData.default) {
    await ShippingAddress.updateMany(
      {
        user: user._id,
        default: true
      },
      { default: false }
    );
  }

  let newShippingAddress: IShippingAddress | null | unknown;

  if (isUpdateSession) {
    newShippingAddress = await ShippingAddress.findByIdAndUpdate(
      addressFormData._id,
      addressFormData satisfies Partial<IShippingAddress>,
      { new: true, lean: true }
    );
  } else {
    newShippingAddress = await ShippingAddress.create({
      ...addressFormData,
      _id: undefined,
      country: new Types.ObjectId(addressFormData.country),
      user: new Types.ObjectId(user._id)
    } satisfies ShippingAddressRawSchema);
  }

  if (!newShippingAddress) throw new Error("Failed to upsert shipping address!");

  return JSON.parse(JSON.stringify(newShippingAddress)) as IShippingAddress;
};

export const placeOrder = async (
  shippingAddress: IShippingAddress,
  cartId: string
): Promise<{ orderId: string }> => {
  // Ensure the user is authenticated
  const user = await authenticate();

  const userId = user._id;

  // Fetch user's cart with all items
  const cart = await Cart.findOne({
    _id: cartId
  }).lean<ICart>();

  if (!cart) throw new Error("Cart not found.");

  const cartItems = cart.cartItems;

  // Fetch product, variant, and size data from the database for validation
  const validatedCartItems = await Promise.all(
    cartItems.map(async (cartProduct) => {
      const {
        product: productId,
        variant: variantId,
        size: sizeId,
        quantity
      } = cartProduct;

      // Fetch the product, variant, and size from the database
      const productTemp = await Product.findOne({
        _id: productId
      })
        .populate({ path: "store" })
        .populate({ path: "freeShipping", populate: "eligibleCountries" })
        .populate({ path: "variants", match: { _id: variantId } });

      type OrderProduct = MergeType<
        IProduct,
        {
          store: IStore;
          variants: IProductVariant[];
          freeShipping: FreeShippingWithCountries;
        }
      >;
      const product: OrderProduct = JSON.parse(JSON.stringify(productTemp));

      if (!product || product.variants.length === 0) {
        throw new Error(
          `Invalid product, variant, or size combination for productId ${productId}, variantId ${variantId}, sizeId ${sizeId}`
        );
      }

      const variant = product.variants[0];
      const size = variant.sizes.find((size) => size._id.toString() === sizeId);
      if (!size) throw new Error("Invalid size or doesn't belong to the product variant");

      // Validate stock and price
      const validQuantity = Math.min(quantity, size.quantity);

      const price = size.discount
        ? size.price - size.price * (size.discount / 100)
        : size.price;

      // Calculate Shipping details
      const countryId = shippingAddress.country;

      const temp_country = await Country.findOne({
        _id: countryId
      }).lean<CountrySchema>();

      if (!temp_country) throw new Error("Failed to get Shipping details for order.");

      const country = {
        name: temp_country.name,
        code: temp_country.code,
        city: "",
        region: ""
      };

      let details = {
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false
      };

      if (country) {
        const temp_details = await getShippingDetails(
          product.shippingFeeMethod,
          country,
          product.store,
          product.freeShipping
        );
        if (temp_details) {
          details = temp_details;
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
        storeId: product.store._id,
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

  // Define the type for grouped items by store
  type GroupedItems = { [storeId: string]: typeof validatedCartItems };

  // Group validated items by store
  const groupedItems = validatedCartItems.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.storeId]) acc[item.storeId] = [];
    acc[item.storeId].push(item);
    return acc;
  }, {} as GroupedItems);

  // Create the order
  const order = await Order.create({
    user: new Types.ObjectId(userId),
    shippingAddress: new Types.ObjectId(shippingAddress._id),
    orderStatus: "Pending",
    paymentStatus: "Pending",
    subTotal: 0, // Will calculate below
    shippingFees: 0, // Will calculate below
    total: 0, // Will calculate below,
    groups: [] // assigning empty [] at the initial time
  } satisfies OrderRawSchema);

  // Iterate over each store's items and create OrderGroup and OrderItems
  let orderTotalPrice = 0;
  let orderShippingFee = 0;
  const orderGroupIds: Types.ObjectId[] = [];

  for (const [storeId, items] of Object.entries(groupedItems)) {
    // Calculate store-specific totals
    const groupedTotalPrice = items.reduce((acc, item) => acc + item.totalPrice, 0);

    const groupShippingFees = items.reduce((acc, item) => acc + item.shippingFee, 0);

    const { shippingService, deliveryTimeMin, deliveryTimeMax } =
      await getDeliveryDetailsForStoreByCountry(storeId, shippingAddress._id);

    // Create an OrderGroup for this store
    const orderGroup: OrderGroupSchema = await OrderGroup.create({
      order: new Types.ObjectId(order._id),
      store: new Types.ObjectId(storeId),
      status: "Pending",
      subTotal: groupedTotalPrice - groupShippingFees,
      shippingFees: groupShippingFees,
      total: groupedTotalPrice,
      shippingService: shippingService,
      shippingDeliveryMin: deliveryTimeMin,
      shippingDeliveryMax: deliveryTimeMax,
      items: [] // assigning empty [] at the initial time
    } satisfies OrderGroupRawSchema);

    // Create OrderItems for this OrderGroup
    const orderItemIds: Types.ObjectId[] = [];
    for (const item of items) {
      const orderItem: OrderItemSchema = await OrderItem.create({
        orderGroup: new Types.ObjectId(orderGroup._id),
        product: new Types.ObjectId(item.productId),
        variant: new Types.ObjectId(item.variantId),
        size: new Types.ObjectId(item.sizeId),
        productSlug: item.productSlug,
        variantSlug: item.variantSlug,
        sku: item.sku,
        name: item.name,
        image: item.image,
        productSize: item.size,
        quantity: item.quantity,
        price: item.price,
        shippingFee: item.shippingFee,
        totalPrice: item.totalPrice
      } satisfies OrderItemRawSchema);

      orderItemIds.push(orderItem._id);
    }

    // Update order totals
    orderTotalPrice += groupedTotalPrice;
    orderShippingFee += groupShippingFees;

    orderGroupIds.push(orderGroup._id);

    // updating the OrderGroup with items ids
    await OrderGroup.findByIdAndUpdate(orderGroup._id, {
      items: orderItemIds
    } satisfies Partial<OrderGroupSchema>);
  }

  // Update the main order with the final totals
  await Order.updateOne(
    {
      _id: order._id
    },
    {
      subTotal: orderTotalPrice - orderShippingFee,
      shippingFees: orderShippingFee,
      total: orderTotalPrice,
      groups: orderGroupIds
    } satisfies Partial<OrderSchema>
  );

  // Delete cart
  /*
  await db.cart.delete({
    where: {
      _id: cartId,
    },
  });
  */

  return {
    orderId: order._id
  };
};

export const emptyUserCart = async () => {
  // Ensure the user is authenticated
  const user = await authenticate();

  const userId = user._id;

  const res = await Cart.deleteOne({
    user: userId
  });
  if (!res) throw new Error("An error occured while deleting the cart!");

  return null;
};
