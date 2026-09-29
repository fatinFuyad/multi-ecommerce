"use client";

import { Button } from "@/components/ui/button";
import { ProductCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import ProductCardImageSwiper from "./swiper";
import VariantSwitcher from "./variant-switcher";

export default function ProductCard({
  product
}: {
  product: ProductCardType;
  // product: ProductWithFilteredVariants;
}) {
  const { name, rating, sales, variants, slug } = product;
  const [variant, setVariant] = useState<ProductCardType["variants"][0]>(variants[0]);
  const { variantName, images } = variant;

  return (
    <div>
      <div
        className={cn(
          "group w-48 sm:w-[225px] relative transition-all duration-75 bg-muted ease-in-out p-4 rounded-xl border border-transparent hover:shadow-xl hover:border-primary-mid",
          {
            "": true
          }
        )}
      >
        <div className="relative w-full h-full">
          <Link
            href={`/product/${slug}/${variant.slug}`}
            className="w-full relative inline-block overflow-hidden"
          >
            {/* IMAGE SWIPER */}
            <ProductCardImageSwiper images={images} />
            {/* TITLE*/}
            <div className="text-sm overflow-ellipsis line-clamp-1">
              {name} - {variantName}
            </div>
            {/* RATINGS & SALES */}
            {product.rating > 0 && product.sales > 0 && (
              <div className="flex items-center gap-x-1 h-5 mt-2">
                <ReactStars
                  count={5}
                  size={24}
                  color="#F5F5F5"
                  activeColor="#FFD804"
                  value={rating}
                  isHalf
                  edit={false}
                />
                <div className="text-xs text-secondary-foreground">{sales} sold</div>
              </div>
            )}
            {/* PRICE */}
          </Link>
        </div>
        <div className="hidden group-hover:block absolute -left-[1px] bg-muted w-[calc(100%+2px)] border border-primary-mid border-t-0 px-4 pb-4 rounded-xl shadow-xl z-30 space-y-2">
          {/* VARIANT SWITCHER */}
          <VariantSwitcher
            // images={variantImages}
            productSlug={slug}
            variants={variants}
            setVariant={setVariant}
            selectedVariant={variant}
          />
          {/* ACTION BUTTONS*/}
          <div className="flex flex-items gap-x-1">
            <Button className="w-full rounded-xl">Add To Cart</Button>
            <Button variant={"outline"} className="rounded-full hover:bg-primary-mid">
              <Heart className="w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
