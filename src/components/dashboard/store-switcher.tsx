"use client";

import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IStore } from "@/models/Store";
import { useParams, useRouter } from "next/navigation";

// const frameworks = [
// {
//   value: "next.js",
//   label: "Next.js",
// },
// {
//   value: "sveltekit",
//   label: "SvelteKit",
// },
// {
//   value: "nuxt.js",
//   label: "Nuxt.js",
// },
// {
//   value: "remix",
//   label: "Remix",
// },
// {
//   value: "astro",
//   label: "Astro",
// },
// ]

export default function StoreSwitcher({ stores }: { stores: IStore[] }) {
  const [open, setOpen] = useState(false);
  const params: { storeUrl: string } = useParams();
  const router = useRouter();

  const storeItems = stores.map((store) => ({
    label: store.name,
    value: store.url
  }));

  const activeStore = storeItems.find(
    (items) => items.value === params.storeUrl
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {activeStore?.value || "Select store..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {storeItems.length !== 0 && (
            <CommandInput placeholder="Search store..." />
          )}
          <CommandList>
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup>
              {storeItems.map((store) => (
                <CommandItem
                  key={store.value}
                  value={store.value}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/dashboard/seller/stores/${store.value}`);
                  }}
                >
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      activeStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push(`/dashboard/seller/stores/new`);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Create Store
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
