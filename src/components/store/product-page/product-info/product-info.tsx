"use client";

import { Separator } from "@/components/ui/separator";
import { CartProductType, ProductDetailedType, ReviewStatistics } from "@/lib/types";
import { IProductVariant } from "@/models/Product";
import { Dispatch, SetStateAction } from "react";

import ColorWheel from "@/components/shared/color-wheel";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import CopyIcon from "../../icons/copy";
import Countdown from "../../shared/countdown";
import ProductAssurancePolicy from "./assurance-policy";
import ProductPrice from "./product-price";
import SizeSelector from "./size-selector";
import ProductVariantSelector from "./variant-selector";

interface PropsType {
  productData: ProductDetailedType;
  variants: IProductVariant[];
  statistics: ReviewStatistics;
  quantity?: number;
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: any) => void;
  setVariantImages: Dispatch<SetStateAction<IProductVariant["images"]>>;
  setActiveImage: Dispatch<SetStateAction<IProductVariant["images"][0] | null>>;
}

function ProductInfo({
  productData,
  variants,
  statistics,
  sizeId,
  handleChange,
  setVariantImages,
  setActiveImage
}: PropsType) {
  // Destructure necessary properties from the productData object
  const { name, store, averageRating } = productData;
  const [variant] = productData.variants; // one [variant] found with the variant slug;
  const { sku, colors, sizes, isSale, saleEndDate, variantName } = variant;

  const { totalReviews } = statistics;
  // Function to copy the SKU to the clipboard
  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      toast.success("Copied successfully");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="relative w-full xl:w-[540px]">
      {/* TITLE OF THE PRODUCT */}
      <div>
        <h1 className="text-primary inline font-bold leading-5">
          {name} · {variantName}
        </h1>
      </div>

      {/* SKU - RATINGS - REVIEWS COUNT FOR PRODUCT */}
      <div className="flex items-center text-xs mt-2">
        {/* STORE LINK */}
        <Link
          href={`/store/${store.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="w-full flex items-center gap-x-1">
            <Image
              src={store.logo}
              alt={store.name}
              width={100}
              height={100}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </Link>
        {/* PRODUCT SKU */}
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-muted-foreground">
            SKU: {sku}
          </span>
          <span
            className="inline-block align-middle text-primary mx-1 cursor-pointer"
            onClick={copySkuToClipboard}
          >
            <CopyIcon />
          </span>
        </div>

        {/* RATINGS AND REVIEW */}
        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap">
          <ReactStars
            count={5}
            size={24}
            color="#F5F5F5"
            activeColor="#FFD804"
            value={averageRating}
            isHalf={true}
            edit={false}
          />
          <Link href="#reviews" className="text-[#ffd804] hover:underline">
            (
            {totalReviews === 0
              ? "No review yet"
              : totalReviews === 1
                ? "1 review"
                : `${totalReviews} reviews`}
            )
          </Link>
        </div>
      </div>
      {/* PRICE AND SALE COUNTDOWN TIMER */}
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice sizeId={sizeId} sizes={sizes} handleChange={handleChange} />
        {isSale && saleEndDate && (
          <div className="mt-4 pb-2">
            <Countdown targetDate={saleEndDate} />
          </div>
        )}
      </div>
      <Separator className="mt-2" />
      {/* COLOR WHEEL AND VARIANT SWITCHER */}
      <div className="mt-4 space-y-2">
        <div className="relative flex items-center justify-between text-main-primary font-bold">
          <span className="flex items-center gap-x-2">
            {colors.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors} size={25} />
          </span>
        </div>
        <div className="mt-4">
          {variants.length > 0 && (
            <ProductVariantSelector
              variants={variants}
              productSlug={productData.slug}
              variantSlug={productData.variants[0].slug}
              setVariantImages={setVariantImages}
              setActiveImage={setActiveImage}
            />
          )}
        </div>
      </div>
      {/* Size selector */}
      <div className="space-y-2 pb-2 mt-4">
        <div>
          <h1 className="text-main-primary font-bold">Size </h1>
        </div>
        <SizeSelector sizes={sizes} sizeId={sizeId} handleChange={handleChange} />
      </div>
      {/* Product assurance */}
      <Separator className="mt-2" />
      <ProductAssurancePolicy />
    </div>
  );
}

export default ProductInfo;
