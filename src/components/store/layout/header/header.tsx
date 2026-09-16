import Link from "next/link";
import UserMenu from "./user-menu/user-menu";
import Cart from "./cart";
import DownloadApp from "./download-app";
import Search from "./search/search";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import CountryLanguageCurrencySelector from "./country-lang-curr-selector";
import { cookies, headers } from "next/headers";
import { UserCountry } from "@/lib/types";

export default function Header() {
  // Get the user's country cookie. if missing set default country
  const countryCookie = cookies().get("userCountry");
  let userCountry: UserCountry = {
    name: "United States",
    code: "US",
    city: "New York",
    region: ""
  };

  if (countryCookie) {
    userCountry = JSON.parse(countryCookie.value);
  }

  return (
    <div className="bg-gradient-to-r from-primary to-primary-light">
      <div className="h-full w-full lg:flex px-4 lg:px-12 gap-3">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/">
              <h1 className="font-extrabold text-3xl font-mono">GoShop</h1>
            </Link>
            <div className="flex lg:hidden gap-3">
              <UserMenu />
              <Cart />
              <ThemeToggle />
            </div>
          </div>
          <Search />
        </div>
        <div className="hidden lg:flex items-center w-full lg:w-fit justify-end gap-3">
          <DownloadApp />
          <CountryLanguageCurrencySelector userCountry={userCountry} />
          <UserMenu />
          <Cart />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
