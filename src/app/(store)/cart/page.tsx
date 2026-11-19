import CartContainer from "@/components/store/cart-page/container";
import { UserCountry } from "@/lib/types";
import { cookies } from "next/headers";

export default function CartPage() {
  // Get cookies from the store
  const cookieStore = cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  // Set default country if cookie is missing
  let userCountry: UserCountry = {
    name: "United States",
    city: "",
    code: "US",
    region: ""
  };

  // If cookie exists, update the user country
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as UserCountry;
  }
  return (
    <>
      <CartContainer userCountry={userCountry} />
    </>
  );
}
