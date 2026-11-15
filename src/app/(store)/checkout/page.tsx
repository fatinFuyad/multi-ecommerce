import CheckoutContainer from "@/components/store/checkout-page/container";
import { authenticate } from "@/lib/auth";
import { getUserCountry } from "@/lib/utils";
import { Cart } from "@/models/Order";
import { Country } from "@/models/Shipping-Rate";
import { getAllCountries, getUserShippingAddresses } from "@/services/user";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const user = await authenticate();
  if (!user) redirect("/cart");

  // Get user cart
  const cartDoc = await Cart.findOne({
    user: user._id
  }).lean();

  if (!cartDoc) redirect("/cart");
  const cart = JSON.parse(JSON.stringify(cartDoc));

  // Get user shipping address
  const addresses = await getUserShippingAddresses();

  // Get list of countries
  const countries = await getAllCountries();

  return (
    <div className="bg-card min-h-screen">
      <div className="max-w-conatiner mx-auto py-5 px-2">
        <CheckoutContainer cart={cart} countries={countries} addresses={addresses} />
      </div>
    </div>
  );
}
