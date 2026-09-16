"use client";

import { ProductDetailedType, ProductShippingDetailsType } from "@/lib/types";
import { IProductVariant } from "@/models/Product";
import { ReactNode, useState } from "react";
import ProductInfo from "./product-info/product-info";
import ProductSwiper from "./product-swiper";
import ReturnPrivacySecurityCard from "./shipping/returns-security-privacy-card";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";

interface Props {
  productData: ProductDetailedType; // ProductPageDataType;
  variants: IProductVariant[];
  shippingDetails: ProductShippingDetailsType;
  sizeId?: string;
  children: ReactNode;
}

function ProductPageContainer({
  productData,
  variants,
  shippingDetails,
  sizeId,
  children
}: Props) {
  const [{ images, weight }] = productData.variants; // active variant
  // State for temporary product images
  const [variantImages, setVariantImages] = useState<IProductVariant["images"]>(images);
  // useState hook to manage the active image being displayed, initialized to the first image in the array
  const [activeImage, setActiveImage] = useState<IProductVariant["images"][0] | null>(
    images[0]
  );

  return (
    <div className="relative">
      <div className="w-full 2xl:flex 2xl:justify-between">
        {/* PRODUCT IMAGE SWIPER */}
        {images && <ProductSwiper images={images} />}
        {/* <ProductSwiper
          images={variantImages.length > 0 ? variantImages : images}
          activeImage={activeImage || images[0]}
          setActiveImage={setActiveImage}
        /> */}
        <div className="w-full mt-4 md:mt-0 flex flex-col xl:justify-between xl:p-8 gap-4 md:flex-row">
          {/* PRODUCT MAIN INFO */}
          <ProductInfo
            productData={productData}
            variants={variants}
            sizeId={sizeId}
            //  handleChange={handleChange}
            setVariantImages={setVariantImages}
            setActiveImage={setActiveImage}
          />

          {/* SHIPPING DETAILS & BUY ACTION BUTTON */}
          <div className="w-[390px]">
            <div className="z-20">
              <div className="bg-secondary border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {
                  <>
                    <ShipTo
                      countryCode={shippingDetails.countryCode}
                      countryName={shippingDetails.countryName}
                      city={shippingDetails.city}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={shippingDetails}
                        quantity={5}
                        weight={weight}
                      />
                    </div>
                    <ReturnPrivacySecurityCard
                      returnPolicy={shippingDetails.returnPolicy}
                    />
                  </>
                }
                {/* Action buttons */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
}

export default ProductPageContainer;
