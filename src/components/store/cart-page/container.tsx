"use client";
import { useCartStore } from "@/hooks/cart-store";
import { CartProductType, UserCountry } from "@/lib/types";
import { updateCartWithLatest } from "@/services/user";
import { useEffect, useState } from "react";
import { SecurityPrivacyCard } from "../product-page/returns-security-privacy-card";

import FullPageLoader from "@/components/shared/fullpage-loader";
import useFromStore from "@/hooks/useFromStore";
import CartProduct from "../cards/cart-product";
import FastDelivery from "../cards/fast-delivery";
import CountryNote from "../shared/country-note";
import CartHeader from "./cart-header";
import EmptyCart from "./empty-cart";
import CartSummary from "./summary";

export default function CartContainer({ userCountry }: { userCountry: UserCountry }) {
  const cartItems = useFromStore(useCartStore, (state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false);

  const [selectedItems, setSelectedItems] = useState<CartProductType[]>([]);
  const [totalShippingFee, setTotalShipping] = useState<number>(0);

  useEffect(() => {
    if (cartItems !== undefined) {
      setIsCartLoaded(true); // Flag indicating cartItems has finished isLoading
    }
  }, [cartItems]);

  useEffect(() => {
    const loadAndSyncCart = async () => {
      if (cartItems?.length) {
        try {
          const updatedCart = await updateCartWithLatest(cartItems);
          setCart(updatedCart);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Failed to sync cart:", error);
        }
      }
    };

    loadAndSyncCart();
  }, [isCartLoaded, userCountry]);

  if (isLoading)
    return <FullPageLoader loadingText="Loading Cart..." isFullPage isBlurry />;
  if (!cartItems || !cartItems.length) return <EmptyCart />;

  return (
    <div className="bg-card min-h-[calc(100vh-65px)]">
      <div className="max-w-[1200px] mx-auto py-6 flex">
        <div className="min-w-0 flex-1">
          {/* Cart header */}
          <CartHeader
            cartItems={cartItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
          <div className="my-2">
            <CountryNote country={userCountry.name} />
          </div>
          <div className="h-auto overflow-x-hidden overflow-auto mt-2">
            {/* Cart items */}
            {cartItems.map((product) => (
              <CartProduct
                key={product.variantId}
                product={product}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                setTotalShipping={setTotalShipping}
                totalShippingFee={totalShippingFee}
                userCountry={userCountry}
              />
            ))}
          </div>
        </div>
        {/* Cart side */}
        <div className="sticky top-4 ml-5 w-[380px] max-h-max">
          {/* Cart summary */}
          <CartSummary cartItems={cartItems} totalShippingFee={totalShippingFee} />
          <div className="mt-2 p-4 bg-background px-6">
            <FastDelivery />
          </div>
          <div className="mt-2 p-4 bg-background px-6">
            <SecurityPrivacyCard />
          </div>
        </div>
      </div>
    </div>
  );
}
