import { ProductCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type HomepageVariant = ProductCardType["variants"][0];
interface Props {
  productSlug: ProductCardType["slug"];
  variants: ProductCardType["variants"];
  setVariant: Dispatch<SetStateAction<HomepageVariant>>;
  selectedVariant: HomepageVariant;
}

function VariantSwitcher({ productSlug, variants, setVariant, selectedVariant }: Props) {
  return (
    <div>
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {variants.map((variant, index) => {
            // console.log(variants[index].variantId, selectedVariant.variantId);
            return (
              <Link
                key={index}
                href={`/product/${productSlug}/${variant.slug}`}
                className={cn("p-0.5 rounded-full border-2 border-transparent", {
                  "border-purple-500": variant._id === selectedVariant._id
                })}
                onMouseEnter={() => {
                  const selectVariant = variants[index];
                  setVariant(selectVariant);
                }}
              >
                <Image
                  src={variant.variantImage}
                  alt="variant_img"
                  width={100}
                  height={100}
                  className="w-8 h-8 object-cover rounded-full"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VariantSwitcher;
