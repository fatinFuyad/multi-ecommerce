import { VariantImageType, VariantSimplified } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface Props {
  images: VariantImageType[];
  variants: VariantSimplified[];
  setVariant: Dispatch<SetStateAction<VariantSimplified>>;
  selectedVariant: VariantSimplified;
}

function VariantSwitcher({ images, variants, setVariant, selectedVariant }: Props) {
  return (
    <div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {images.map((img, index) => {
            console.log(variants[index].variantId, selectedVariant.variantId);
            return (
              <Link
                key={index}
                href={img.url}
                className={cn("p-0.5 rounded-full border-2 border-transparent", {
                  "border-purple-500":
                    variants[index].variantId === selectedVariant.variantId
                })}
                onMouseEnter={() => {
                  const selectVariant = variants[index];
                  setVariant(selectVariant);
                }}
              >
                <Image
                  src={img.image}
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
