"use client";

import { ICart, IShippingAddress, UserShippingAddressType } from "@/models/Order";
import { ICountry } from "@/models/Shipping-Rate";
import { FC, useState } from "react";
import CheckoutProductCard from "../cards/checkout-product";
import UserShippingAddresses from "../shared/shipping-addresses/shipping-addresses";
import PlaceOrderCard from "../cards/place-order";

interface Props {
  addresses: UserShippingAddressType[];
  cart: ICart;
  countries: ICountry[];
}

const CheckoutContainer: FC<Props> = ({ cart, countries, addresses }) => {
  const [selectedAddress, setSelectedAddress] = useState<IShippingAddress | null>(null);

  return (
    <div className="flex">
      <div className="flex-1 my-3">
        <UserShippingAddresses
          addresses={addresses}
          countries={countries}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <div className="w-full py-4 px-4 bg-background my-3">
          <div className="relative">
            {cart.cartItems.map((cartItem) => (
              <CheckoutProductCard key={cartItem.variant} cartItem={cartItem} />
            ))}
          </div>
        </div>
      </div>
      <PlaceOrderCard
        cartId={cart._id}
        shippingAddress={selectedAddress}
        shippingFees={cart.shippingFees}
        subTotal={cart.subTotal}
        total={cart.total}
      />
    </div>
  );
};

export default CheckoutContainer;
