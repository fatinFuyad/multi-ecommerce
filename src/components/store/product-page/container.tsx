"use client";

import { ProductDetailedType } from "@/lib/types";
import { ReactNode } from "react";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";

// import { CartProductType, ProductPageDataType } from "@/lib/types";

interface Props {
  productData: ProductDetailedType; // ProductPageDataType;
  sizeId?: string;
  children: ReactNode;
}

function ProductPageContainer({ productData, sizeId, children }: Props) {
  // If there is no product data available, render nothing (null)
  if (!productData) return null;
  const { images } = productData.variants[0];

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* PRODUCT IMAGE SWIPER */}
        {images && <ProductSwiper images={images} />}
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* PRODUCT MAIN INFO */}
          <ProductInfo productData={productData} sizeId={sizeId} />

          {/* BUY ACTIONS CARD */}
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
}

export default ProductPageContainer;
