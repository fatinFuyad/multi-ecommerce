import { CategorySchema, ICategory } from "@/models/Category";
import {
  IProduct,
  IProductVariant,
  ProductSchema,
  ProductVariantSchema
} from "@/models/Product";
import { ICountry, IShippingRate } from "@/models/Shipping-Rate";
import { IStore, StoreSchema } from "@/models/Store";
import { ISubcategory, SubcategorySchema } from "@/models/Subcategory";
import { IUser } from "@/models/User";
import { InferSchemaType, Types } from "mongoose";

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

export type ProductDetailedDocType = Omit<
  ProductSchema,
  "variants" | "subcategory" | "category" | "store"
> & {
  variants: ProductVariantSchema[];
  subcategory: SubcategorySchema;
  category: CategorySchema;
  store: StoreSchema;
};

export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: IProductVariant["images"];
  sizes: IProductVariant["sizes"];
};

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: string;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  weight: number;
  shippingMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isFreeShipping: boolean;
};

export type VariantImageType = {
  url: string; // url for the product variant page
  image: string; // actual img src
};

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

export type ProductShippingDetailsType = {
  shippingFeeMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  returnPolicy: string;
  countryCode: string;
  countryName: string;
  city: string;
  isFreeShipping: boolean;
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

// CUSTOM TYPE UTILITY

export type MergeType<T, U> = Omit<T, keyof U> & U;

export type PrettifyType<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * @description Adds _id field to the target Type
 * @param T - the target Type
 * @param _ID - optional. Define type of the _id defualt is string;
 */
export type Add_id<T, _ID = string> = PrettifyType<{ _id: _ID } & T>;

/**
 * @description Adds _id: Types.ObjectId field to the target Type
 * @param T - the target Type
 */
export type AddObjectId<T> = PrettifyType<{ _id: Types.ObjectId } & T>;

/**
 * @description Infers an Schema Defination and merges _id: Types.ObjectId with the SchemaType;
 * @param T - the target Type
 */
export type InferSchemaWithId<T, I = Types.ObjectId> = PrettifyType<
  { _id: I extends string ? string : Types.ObjectId } & InferSchemaType<T>
>;

/**
 * @description Makes the fields of an existing Schema Type `Partial` with the provided keys
 * @param T - The target Schema
 */
export type PartialSchema<T, K extends keyof T> = PrettifyType<
  MergeType<T, Partial<Pick<T, K>>>
>;

/**
 * @description Creates an Interface type for returned data type from API backend
 * @param
 * - T - The target Schema
 * - R - The received type that is to be merged with the Schema type
 */
export type IFromSchema<
  T,
  R extends Partial<Record<keyof T, any>> = object
> = PrettifyType<MergeType<Stringify<T>, R>>;

/**
 * @description Stringifies Types.ObjectId and NativeDate to string type for any field of the target Type. *`Note`: Does not change optional or other types
 * @param T - The Target Type
 */
export type Stringify<T> = {
  [k in keyof T]: T[k] extends Types.ObjectId | NativeDate
    ? string
    : T[k] extends Types.ObjectId[]
      ? string[]
      : T[k];
};

export type ObjFromDocArr<T> = T extends Types.DocumentArray<infer O, any> ? O : never;

export type InterfaceFromSchema<T> = T extends Types.ObjectId
  ? string
  : T extends NativeDate | Date
    ? string
    : T extends Types.DocumentArray<infer O, any>
      ? PrettifyType<{ _id: string } & InterfaceFromSchema<O>>[]
      : T extends readonly (infer U)[]
        ? InterfaceFromSchema<U>[]
        : T extends object
          ? {
              [K in keyof T]: InterfaceFromSchema<T[K]>;
            }
          : T extends null | undefined
            ? undefined
            : T;

export type MongooseToPlain<T> =
  // ─────────────────────────────────────────────
  // 1. ObjectId → string
  // ─────────────────────────────────────────────
  T extends Types.ObjectId
    ? string
    : // ─────────────────────────────────────────────
      // 2. Date / NativeDate → string
      // ─────────────────────────────────────────────
      T extends Date
      ? string
      : // ─────────────────────────────────────────────
        // 3. DocumentArray → plain array
        //
        // IMPORTANT: this must come BEFORE `object`
        // because DocumentArray is itself an object.
        // ─────────────────────────────────────────────
        T extends Types.DocumentArray<infer U, any>
        ? MongooseToPlain<U>[]
        : // ─────────────────────────────────────────────
          // 4. Subdocument → extract its underlying object
          // ─────────────────────────────────────────────
          T extends Types.Subdocument<any, any, infer U>
          ? MongooseToPlain<U>
          : // ─────────────────────────────────────────────
            // 5. Normal arrays / readonly arrays
            // ─────────────────────────────────────────────
            T extends readonly (infer U)[]
            ? MongooseToPlain<U>[]
            : // ─────────────────────────────────────────────
              // 6. Map → Record
              // ─────────────────────────────────────────────
              T extends Map<string, infer V>
              ? Record<string, MongooseToPlain<V>>
              : // ─────────────────────────────────────────────
                // 7. Objects → recursively transform properties
                // ─────────────────────────────────────────────
                T extends object
                ? {
                    [K in keyof T]: MongooseToPlain<T[K]>;
                  }
                : // ─────────────────────────────────────────────
                  // 8. string / number / boolean / null / etc.
                  // remain unchanged
                  // ─────────────────────────────────────────────
                  T;
