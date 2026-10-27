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

export default function ProductCard({ product }: { product: ProductCardType }) {
  const { name, averageRating, sales, variants, slug } = product;
  const [variant, setVariant] = useState<ProductCardType["variants"][0]>(variants[0]);
  if (!variant) return null;

  const { variantName, images } = variant;
  console.log("Average Rating>>>", product.averageRating);
  console.log("ProductCard Variants", variants);

  return (
    <div>
      <div
        className={cn(
          "group w-48 sm:w-[225px] relative transition-all duration-75 bg-muted ease-in-out p-4 rounded-xl border border-transparent hover:shadow-xl hover:border-primary-mid"
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
            {product.averageRating > 0 && product.sales > 0 && (
              <div className="flex items-center gap-x-1 h-5 mt-2">
                <ReactStars
                  count={5}
                  size={24}
                  color="#F5F5F5"
                  activeColor="#FFD804"
                  value={averageRating}
                  isHalf
                  edit={false}
                />
                <div className="text-xs text-secondary-foreground">Sold ({sales})</div>
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
