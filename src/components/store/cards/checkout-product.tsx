import { ICartItem } from "@/models/Order";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutProductCard({ cartItem }: { cartItem: ICartItem }) {
  const { productSlug, variantSlug, size } = cartItem;
  return (
    <div className="bg-background px-6 border-t bordet-t-card select-none">
      <div className="py-4">
        <div className="relative flex self-start">
          {/* Image */}
          <div className="flex items-center">
            <Link href={`/product/${productSlug}/${variantSlug}?size=${size}`}>
              <div className="m-0 mr-4 ml-2 w-28 h-28 bg-card relative rounded-lg">
                <Image
                  src={cartItem.image}
                  width={200}
                  height={200}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </Link>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1">
            {/* Title - Actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <Link
                href={`/product/${productSlug}/${variantSlug}?size=${size}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap overflow-ellipsis"
              >
                {cartItem.name}
              </Link>
            </div>
            {/* Style - Size */}
            <div className="my-1">
              <button className="text-main-primary relative h-[24px] bg-card whitespace-normal px-2.5 py-0 max-w-full text-xs leading-4 rounded-xl font-bold cursor-pointer  outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {cartItem.size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price - Delievery */}
            <div className="flex flex-col justify-between mt-2 relative">
              {/* Price - Qty */}
              <div className="font-bold w-full flex items-start justify-between">
                <div>
                  <span className="inline-block break-all">
                    ${cartItem.price?.toFixed(2)} x {cartItem.quantity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
