"use client";

import {
  CartProductType,
  ProductDetailedType,
  ProductShippingDetailsType,
  ReviewStatistics
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { IProductVariant } from "@/models/Product";
import { ReactNode, useState } from "react";
import SocialShare from "../shared/social-share";
import ProductInfo from "./product-info/product-info";
import ProductSwiper from "./product-swiper";
import QuantitySelector from "./quantity-selector";
import ReturnPrivacySecurityCard from "./shipping/returns-security-privacy-card";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";

interface Props {
  productData: ProductDetailedType; // ProductPageDataType;
  variants: IProductVariant[];
  shippingDetails: ProductShippingDetailsType;
  sizeId?: string;
  statistics: ReviewStatistics;
  children: ReactNode;
}

function ProductPageContainer({
  productData,
  variants,
  shippingDetails,
  sizeId,
  statistics,
  children
}: Props) {
  const [variant] = productData.variants; // active variant
  const { images, weight, variantName, sizes } = variant;
  // State for temporary product images
  const [variantImages, setVariantImages] = useState<IProductVariant["images"]>(images);
  // useState hook to manage the active image being displayed, initialized to the first image in the array
  const [activeImage, setActiveImage] = useState<IProductVariant["images"][0] | null>(
    images[0]
  );

  // Initialize the default product data for the cart item
  const selectedSize = sizes.find((size) => size._id === sizeId);
  const cartData: CartProductType = {
    productId: productData._id,
    variantId: variant._id,
    productSlug: productData.slug,
    variantSlug: variant.slug,
    name: productData.name,
    variantName: variant.variantName,
    image: variant.images[0].url,
    variantImage: variant.variantImage,
    quantity: 1,
    price: (selectedSize && selectedSize.price * (1 - selectedSize.discount / 100)) || 0,
    sizeId: sizeId || "",
    size: selectedSize?.size || "",
    stock: selectedSize?.quantity || 1,
    weight: variant.weight,
    shippingMethod: shippingDetails.shippingFeeMethod,
    shippingService: shippingDetails.shippingService,
    shippingFee: shippingDetails.shippingFee,
    extraShippingFee: shippingDetails.extraShippingFee,
    deliveryTimeMin: shippingDetails.deliveryTimeMin,
    deliveryTimeMax: shippingDetails.deliveryTimeMax,
    isFreeShipping: shippingDetails.isFreeShipping
  };

  // useState hook to manage the product's state in the cart
  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(cartData);

  // Usestate hook to manage product validity to be added to cart
  // const [isProductValid, setIsProductValid] = useState<boolean>(false);

  // Function to handle state changes for the product properties
  const handleChange = (property: keyof CartProductType, value: any) => {
    setProductToBeAddedToCart((prevProduct) => ({
      ...prevProduct,
      [property]: value
    }));
  };

  return (
    <div className="relative">
      <div className="w-full 2xl:flex 2xl:justify-between">
        {/* PRODUCT IMAGE SWIPER */}
        {images && <ProductSwiper images={images} />}
        <div className="w-full mt-4 md:mt-0 flex flex-col xl:justify-between xl:p-8 gap-4 md:flex-row">
          {/* PRODUCT MAIN INFO */}
          <ProductInfo
            productData={productData}
            variants={variants}
            sizeId={sizeId}
            statistics={statistics}
            handleChange={handleChange}
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
                <div className="mt-5 bg-secondary bottom-0 pb-4 space-y-3 sticky">
                  {/* Qty selector */}
                  {sizeId && (
                    <div className="w-full flex justify-end mt-4">
                      <QuantitySelector
                        productId={productToBeAddedToCart.productId}
                        variantId={productToBeAddedToCart.variantId}
                        sizeId={productToBeAddedToCart.sizeId}
                        quantity={productToBeAddedToCart.quantity}
                        stock={productToBeAddedToCart.stock}
                        handleChange={handleChange}
                        sizes={sizes}
                      />
                    </div>
                  )}
                  {/* Action buttons */}
                  <button className="relative w-full py-2.5 min-w-20 bg-primary-mid hover:bg-primary text-secondary-foreground h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-primary-light cursor-pointer transition-all duration-300 ease-bezier-1 select-none">
                    <span>Buy now</span>
                  </button>
                  <button
                    // disabled={!isProductValid}
                    className={cn(
                      "relative w-full py-2.5 min-w-20 border-primary-light hover:bg-primary/50 text-primary-mid-hover h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border cursor-pointer transition-all duration-300 ease-bezier-1 select-none",
                      {
                        "cursor-not-allowed": false // maxQty <= 0,
                      }
                    )}
                    // onClick={() => handleAddToCart()}
                  >
                    <span>Add to cart</span>
                  </button>
                  {/* Share to socials */}
                  <SocialShare
                    url={`/product/${productData.slug}/${variant.slug}`}
                    quote={`${productData.name} · ${variantName}`}
                  />
                </div>
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
