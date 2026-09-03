import { cn } from "@/lib/utils";
import { IProductVariant } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  variants: IProductVariant[];
  productSlug: string;
  variantSlug: string;
  setVariantImages: Dispatch<SetStateAction<IProductVariant["images"]>>;
  setActiveImage: Dispatch<SetStateAction<IProductVariant["images"][0] | null>>;
}

const ProductVariantSelector: FC<Props> = ({
  variants,
  productSlug,
  variantSlug, // the current variant which user clicked
  setVariantImages,
  setActiveImage
}) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {variants.map((variant, i) => (
        <Link
          href={`/product/${productSlug}/${variant.slug}`}
          key={i}
          onMouseEnter={() => {
            setVariantImages(variant.images);
            setActiveImage(variant.images[0]);
          }}
          onMouseLeave={() => {
            setVariantImages([] as any);
            setActiveImage(null);
          }}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full grid place-items-center p-0.5  overflow-hidden border border-transparent hover:border-main-primary cursor-pointer transition-all duration-75 ease-in",
              {
                "border-main-primary": variantSlug === variant.slug
              }
            )}
          >
            <Image
              src={variant.variantImage}
              alt={`product variant ${variant.slug}`}
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductVariantSelector;
