////////////////////////////////////////////
import { CartProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IVariantSize } from "@/models/Product";
import { FC, useEffect, useState } from "react";

interface Props {
  sizeId?: string | undefined;
  sizes: IVariantSize[];
  isCard?: boolean;
  handleChange: (property: keyof CartProductType, value: any) => void;
}

const ProductPrice: FC<Props> = ({ sizeId, sizes, isCard, handleChange }) => {
  // Scenario 2: SizeId passed, find the specific size and return its details
  const [selectedSize, setSelectedSize] = useState<IVariantSize | undefined>(undefined);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  // Update product to be added to cart with price and stock quantity
  useEffect(() => {
    const selectedSize = sizes.find((size) => size._id === sizeId);
    if (!selectedSize) return;
    setSelectedSize(selectedSize);

    // Calculate the price after the discount
    const discountedPrice = selectedSize.price * (1 - selectedSize.discount / 100);
    setDiscountedPrice(discountedPrice);

    handleChange("price", discountedPrice);
    handleChange("stock", selectedSize.quantity);
  }, [sizeId]);

  // if (!selectedSize) {
  //   return <>Select a size to know the price</>;
  // }

  // Scenario 1: No sizeId passed, calculate range of prices and total quantity
  if (!sizeId) {
    // Calculate discounted prices for all sizes
    const discountedPrices = sizes.map((size) => size.price * (1 - size.discount / 100));

    const totalQuantity = sizes.reduce((total, size) => total + size.quantity, 0);

    const minPrice = Math.min(...discountedPrices).toFixed(2);
    const maxPrice = Math.max(...discountedPrices).toFixed(2);

    // If all prices are the same, return a single price; otherwise, return range
    const priceDisplay =
      minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

    // If a discount exist when minPrice=MaxPrice
    let discount = 0;
    if (minPrice === maxPrice) {
      const checkDiscount = sizes.find((s) => s.discount > 0);
      if (checkDiscount) {
        discount = checkDiscount.discount;
      }
    }

    return (
      <div>
        <div className="text-orange-primary inline-block font-bold leading-none mr-2.5">
          <span
            className={cn("inline-block text-4xl text-nowrap", {
              "text-lg": isCard
            })}
          >
            {priceDisplay}
          </span>
        </div>
        {!sizeId && !isCard && (
          <div className="text-card-foreground/80 text-xs leading-4 mt-1">
            <span>Note : Select a size to see the exact price</span>
          </div>
        )}
        {!sizeId && !isCard && <p className="mt-2 text-xs">{totalQuantity} pieces</p>}
      </div>
    );
  }

  if (!selectedSize) {
    return <>Select a size to know the price</>;
  }
  return (
    <div>
      <div className="text-orange-primary inline-block font-bold leading-none mr-2.5">
        <span className="inline-block text-4xl">${discountedPrice.toFixed(2)}</span>
      </div>
      {selectedSize.price !== discountedPrice && (
        <span className="text-muted-foreground inline-block text-xl font-normal leading-6 mr-2 line-through">
          ${selectedSize.price.toFixed(2)}
        </span>
      )}
      {selectedSize.discount > 0 && (
        <span className="inline-block text-orange-seconadry text-xl leading-6">
          {selectedSize.discount}% off
        </span>
      )}
      <p className="mt-2 text-xs">{selectedSize.quantity} pieces</p>
    </div>
  );
};

export default ProductPrice;
