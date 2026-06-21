"use client";

// React, Next.js
import Link from "next/link";
import { usePathname } from "next/navigation";

// UI Components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

// Icons
import { icons } from "@/constants/icons";

// types
import { DashboardSidebarMenuInterface } from "@/lib/types";

// Utils
import { cn } from "@/lib/utils";

export default function SidebarNavSeller({
  menuLinks
}: {
  menuLinks: DashboardSidebarMenuInterface[];
}) {
  const pathname = usePathname();
  // /dashboard/seller]/stores/[easy-shop/products --> easy-shop
  const splitStore = pathname.split("/stores/")[1];
  const activeStore = splitStore.split("/")[0];
  return (
    <nav
      className="relative overflow-y-scroll"
      style={{ scrollbarWidth: "none" }}
    >
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No Links Found.</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {menuLinks.map((link, index) => {
              let icon;
              const iconSearch = icons.find((icon) => icon.value === link.icon);
              if (iconSearch) icon = <iconSearch.path />;
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent text-accent-foreground":
                      link.link === ""
                        ? pathname === `/dashboard/seller/stores/${activeStore}`
                        : pathname ===
                          `/dashboard/seller/stores/${activeStore}/${link.link}`
                  })}
                >
                  <Link
                    href={`/dashboard/seller/stores/${activeStore}/${link.link}`}
                    className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                    prefetch={false}
                  >
                    {icon}
                    <span>{link.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
}
