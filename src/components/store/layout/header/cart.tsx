import Link from "next/link";
import { CartIcon } from "@/components/store/icons";

export default function Cart() {
  // Get total items in the cart
  const totalItems = 15;
  return (
    <div className="pr-6">
      <Link href="/cart" className="flex gap-1 items-center">
        <p>Cart</p>
        <div className="relative mt-2">
          <span className="inline-block text-3xl">
            <CartIcon />
          </span>
          <span className="absolute top-0 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1 text-sm bg-background rounded-full font-bold aspect-square min-h-6">
            {totalItems}
          </span>
        </div>
      </Link>
    </div>
  );
}
