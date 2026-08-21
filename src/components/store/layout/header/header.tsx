import Link from "next/link";
import UserMenu from "./user-menu/user-menu";
import Cart from "./cart";
import DownloadApp from "./download-app";
import Search from "./search/search";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Header() {
  return (
    // <div className="bg-gradient-to-r from-slate-500 to-slate-800">
    <div className="bg-gradient-to-r from-primary to-primary-light">
      <div className="h-full w-full lg:flex px-4 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl font-mono">GoShop</h1>
            </Link>
            <div className="flex lg:hidden">
              <UserMenu />
              <Cart />
              <ThemeToggle />
            </div>
          </div>
          <Search />
        </div>
        <div className="hidden lg:flex items-center w-full lg:w-fit justify-end pl-6">
          <div className="lg:flex gap-4">
            <DownloadApp />
          </div>
          <UserMenu />
          <Cart />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
