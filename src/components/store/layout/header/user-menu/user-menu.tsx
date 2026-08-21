import { MessageIcon, OrderIcon, WishlistIcon } from "@/components/store/icons";
import { Separator } from "@/components/ui/separator";
import { SignInOutButton } from "@/store/ui/sign-in-out";
import { ChevronDown, UserIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function UserMenu() {
  // Get the current user
  const { user } = await auth({ isRedirect: false });
  return (
    <div className="relative group">
      {/* Trigger */}
      <div>
        {user ? (
          <Image
            src={user.image!}
            alt={user.name!}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-11 items-center py-0 mx-2 cursor-pointer">
            <span className="text-2xl">
              <UserIcon />
            </span>
            <div className="ml-1">
              <span className="block text-xs text-foreground leading-3">Welcome</span>
              <b className="font-bold text-xs text-foreground leading-4">
                <span>Sign in / Register</span>
                <span className="text-foreground scale-[60%] align-middle inline-block">
                  <ChevronDown />
                </span>
              </b>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div
        className={cn("hidden absolute top-0 -left-20 group-hover:block cursor-pointer", {
          "-left-[200px] lg:-left-[140px]": user
        })}
      >
        <div className="relative left-2 mt-10 right-auto bottom-auto pt-2.5 text-card-foreground p-0 text-sm z-40">
          {/* Triangle */}
          <div className="w-0 h-0 absolute left-[149px] top-1 right-24 !border-l-[10px] !border-l-transparent !border-r-[10px] !border-r-transparent !border-b-[10px] border-b-background"></div>
          {/* Menu */}
          <div className="rounded-3xl bg-primary-shade text-sm text-card-foreground shadow-lg">
            <div>
              <div className="pt-5 px-6 pb-0">
                {user ? (
                  <div className="user-avatar flex flex-col items-center justify-center">
                    {/* <UserButton /> */}
                    <Image
                      src={user.image!}
                      alt={user.name!}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button asChild className="w-full hover:bg-primary">
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button
                      variant={"outline"}
                      className="w-full bg-background-shade text-muted-foreground hover:bg-primary-light"
                      asChild
                    >
                      <Link href="/signup">Register</Link>
                    </Button>
                  </div>
                )}
                {user && (
                  <p className="my-3 text-center text-sm text-main-primary cursor-pointer">
                    <SignInOutButton type="signout" />
                  </p>
                )}
                <Separator />
              </div>
              {/* Links */}
              <div className="px-2 pb-4">
                <ul className="grid grid-cols-3 gap-2 py-2.5 ^px-4 w-full">
                  {links.map((item) => (
                    <li key={item.title} className="grid place-items-center">
                      <Link href={item.link} className="space-y-2">
                        <div className="w-14 h-14 rounded-full p-2 grid place-items-center bg-primary-light hover:bg-primary-light/80">
                          <span className="text-primary">{item.icon}</span>
                        </div>
                        <span className="block text-xs">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Separator className="!max-w-64 mx-auto" />
                <ul className="pt-2.5 pr-4 pb-1 pl-4 w-72">
                  {extraLinks.map((item, i) => (
                    <li key={i}>
                      <Link href={item.link} legacyBehavior>
                        <Button
                          variant={"link"}
                          className="block text-sm text-primary py-1.5 hover:underline"
                        >
                          {item.title}
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const links = [
  {
    icon: <OrderIcon />,
    title: "My Orders",
    link: "/profile/orders"
  },
  {
    icon: <MessageIcon />,
    title: "Messages",
    link: "/profile/messages"
  },
  {
    icon: <WishlistIcon />,
    title: "WishList",
    link: "/profile/wishlist"
  }
];
const extraLinks = [
  {
    title: "Settings",
    link: "/"
  },
  {
    title: "Become a Seller",
    link: "/become-seller"
  },
  {
    title: "Help Center",
    link: ""
  },
  {
    title: "Return & Refund Policy",
    link: "/"
  },
  {
    title: "Legal & Privacy",
    link: ""
  },
  {
    title: "Discounts & Offers",
    link: ""
  },
  {
    title: "Order Dispute Resolution",
    link: ""
  },
  {
    title: "Report a Problem",
    link: ""
  }
];
