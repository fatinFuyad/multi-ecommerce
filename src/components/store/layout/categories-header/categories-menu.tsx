import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ICategory } from "@/models/Category";
import { ChevronDown, Menu } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function CategoriesMenu({
  categories,
  open,
  setOpen
}: {
  categories: ICategory[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const toggleMenu = (state: boolean) => {
    setOpen(state);
    // Delay showing the dropdown until the trigger has finished expanding
    if (state) {
      setTimeout(() => {
        setDropdownVisible(true);
      }, 100);
    } else {
      setDropdownVisible(false);
    }
  };

  return (
    <div
      className="relative w-10 h-10 xl:w-64 z-50"
      onMouseEnter={() => toggleMenu(true)}
      onMouseLeave={() => toggleMenu(false)}
    >
      {/* Trigger and Dropdown Container */}
      <div className="relative">
        {/* Trigger */}
        <div
          className={cn(
            "w-12 xl:w-64 h-12 rounded-xl -translate-y-1 xl:translate-y-0 xl:h-11 bg-muted text-secondary-foreground text-xl relative flex items-center cursor-pointer transition-all duration-100 ease-in-out",
            {
              "w-64 bg-secondary/50 text-base rounded-t-lg rounded-b-none scale-100":
                open,
              "scale-75": !open
            }
          )}
        >
          {/* Menu Icon with transition to move right when open */}
          <Menu
            className={cn("absolute top-1/2 -translate-y-1/2 xl:ml-1", {
              "left-5": open,
              "left-3": !open
            })}
          />

          <span
            className={cn("hidden xl:inline-flex xl:ml-11", {
              "inline-flex !ml-14": open
            })}
          >
            All Categories
          </span>

          <ChevronDown
            className={cn("hidden xl:inline-flex scale-75 absolute right-3", {
              "inline-flex": open
            })}
          />
        </div>
        {/* Dropdown */}
        <ul
          className={cn(
            "absolute top-10 left-0 w-64 bg-secondary shadow-lg transition-all duration-100 ease-in-out scrollbar overflow-y-auto",
            {
              "max-h-[520px] opacity-100": dropdownVisible, // Show dropdown
              "max-h-0 opacity-0": !dropdownVisible // Hide dropdown
            }
          )}
        >
          {categories.map((category, i) => (
            <Link
              key={i}
              href={`/browse?category=${category.url}`}
              className="text-secondary-foreground"
            >
              <li className="relative flex items-center m-0 p-3 pl-6 hover:bg-primary-light">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={100}
                  height={100}
                  className="w-6 h-6"
                />
                <span className="text-sm font-normal ml-2 overflow-hidden line-clamp-2 break-words text-main-primary">
                  {category.name}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
