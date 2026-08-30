"use client";

import { ProductDetailedType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import CopyIcon from "../../icons/copy";

interface PropsType {
  productData: ProductDetailedType;
  quantity?: number;
  sizeId: string | undefined;
}

function ProductInfo({ productData, quantity, sizeId }: PropsType) {
  // Check if productData exists, return null if it's missing (prevents rendering when there's no data)
  if (!productData) return null;

  // Destructure necessary properties from the productData object
  const { _id: productId, name, store, rating } = productData;
  const { sku, colors, sizes, isSale, saleEndDate, variantName } =
    productData.variants[0];

  const { totalReviews } = { totalReviews: 101 };

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
      {/* Title */}
      <div>
        <h1 className="text-main-primary inline font-bold leading-5">
          {name} · {variantName}
        </h1>
      </div>
      {/* Sku - Rating - Num reviews */}
      <div className="flex items-center text-xs mt-2">
        {/* Store details */}
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
        {/* Sku - Rating - Num reviews */}
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
            SKU: {sku}
          </span>
          <span
            className="inline-block align-middle text-primary mx-1 cursor-pointer"
            onClick={copySkuToClipboard}
          >
            <CopyIcon />
          </span>
        </div>
        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap">
          <ReactStars
            count={5}
            size={24}
            color="#F5F5F5"
            activeColor="#FFD804"
            value={rating}
            isHalf
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
    </div>
  );
}

export default ProductInfo;
