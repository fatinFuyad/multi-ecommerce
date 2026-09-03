import { ICategory } from "@/models/Category";
import { IProduct, IProductVariant } from "@/models/Product";
import { ICountry, IShippingRate } from "@/models/Shipping-Rate";
import { IStore } from "@/models/Store";
import { ISubcategory } from "@/models/Subcategory";
import { IUser } from "@/models/User";
import { Types } from "mongoose";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

//  response from the backend api route
type BaseResponse = {
  success: boolean;
  status: number;
  total?: number;
  message?: string;
  error?: string;
};
/*
type BaseResponse = {
  success: boolean;
} & (
  | { success: true; message: string; status: 200 | 201 }
  | { success: false; error: string; status: 400 | 404 | 500 }
);
*/

// dynamic property type // interfaced can't be dynamic mapped type
export type ApiResponse<T = { data: null }> = {
  [k in keyof T]: T[k];
} & BaseResponse;

// Merging the type of Subcategory with Category for category field
// this is essential for defining the popolated data type
export type SubcategoryWithCategory = Omit<ISubcategory, "category"> & {
  category: ICategory;
};

export type UserWithStore = Omit<IUser, "stores"> & {
  stores: IStore[];
};

export type ProductWithVariant = Omit<IProduct, "variants"> & {
  variants: IProductVariant[];
};

export type ProductDetailedType = Omit<
  IProduct,
  "variants" | "subcategory" | "category" | "store"
> & {
  variants: IProductVariant[];
  subcategory: ISubcategory;
  category: ICategory;
  store: IStore;
};

export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: IProductVariant["images"];
  sizes: IProductVariant["sizes"];
};

export type VariantImageType = {
  url: string; // url for the product variant page
  image: string; // actual img src
};

export type VariantColor = {
  _id: Types.ObjectId;
  color: string;
};

// VARIANT SIZE TYPE GOT FROM BACKEND
export type VariantSize = {
  _id: Types.ObjectId;
  size: string;
  quantity: number;
  price: number;
  discount: number;
};

export type VariantImage = {
  _id: Types.ObjectId;
  url: string;
  alt: string;
  order?: number | undefined;
};

export type Vimage = IProductVariant["variantImage"];

export interface ProductWithFilteredVariants {
  _id: string;
  slug: string;
  name: string;
  rating: number;
  sales: number;
  variants: VariantSimplified[];
  variantImages: VariantImageType[];
}

export type ShippingRateWithCountry = PrettifyType<
  Omit<IShippingRate, "country"> & {
    country: ICountry;
  }
>;

export type CountryWithShippingRates = {
  storeId: string;
  country: ICountry;
  countryName: string;
  shippingRate: IShippingRate | null;
};

export type UserCountry = {
  name: string;
  code: string;
  city: string;
  region: string;
};

export interface CountryIPInfo {
  ip: string;
  country: string; // BD - not actual country name
  city: string;
  region: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

export interface CountrySelect {
  name: string;
  code: string;
}

export type MergeType<T, U> = Omit<T, keyof U> & U;

export type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};
