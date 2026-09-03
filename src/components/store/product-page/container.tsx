"use client";

import { ProductDetailedType } from "@/lib/types";
import { IProductVariant } from "@/models/Product";
import { ReactNode, useState } from "react";
import ProductInfo from "./product-info/product-info";
import ProductSwiper from "./product-swiper";

// import { CartProductType, ProductPageDataType } from "@/lib/types";

interface Props {
  productData: ProductDetailedType; // ProductPageDataType;
  variants: IProductVariant[];
  sizeId?: string;
  children: ReactNode;
}

function ProductPageContainer({ productData, variants, sizeId, children }: Props) {
  const { images } = productData.variants[0];
  // State for temporary product images
  const [variantImages, setVariantImages] = useState<IProductVariant["images"]>(images);
  // useState hook to manage the active image being displayed, initialized to the first image in the array
  const [activeImage, setActiveImage] = useState<IProductVariant["images"][0] | null>(
    images[0]
  );

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* PRODUCT IMAGE SWIPER */}
        {images && <ProductSwiper images={images} />}
        {/* <ProductSwiper
          images={variantImages.length > 0 ? variantImages : images}
          activeImage={activeImage || images[0]}
          setActiveImage={setActiveImage}
        /> */}
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* PRODUCT MAIN INFO */}
          <ProductInfo
            productData={productData}
            variants={variants}
            sizeId={sizeId}
            //  handleChange={handleChange}
            setVariantImages={setVariantImages}
            setActiveImage={setActiveImage}
          />

          {/* BUY ACTIONS CARD */}
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
}

export default ProductPageContainer;
