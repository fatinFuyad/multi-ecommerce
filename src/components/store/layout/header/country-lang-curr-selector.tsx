"use client";

// React, Next.js
import { useState } from "react";

// Icons
import { ChevronDown } from "lucide-react";
import "/node_modules/flag-icons/css/flag-icons.min.css";

// Types
import { CountrySelect, UserCountry } from "@/lib/types";

// UserCountry selector
import CountrySelector from "@/components/shared/country-selector";

// countries data
import countries from "@/data/countries.json";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CountryLanguageCurrencySelector({
  userCountry
}: {
  userCountry: UserCountry;
}) {
  // Router hook for navigation
  const router = useRouter();
  const { toast } = useToast();

  // State to manage countries dropdown visibility
  const [show, setshow] = useState(false);

  const handleCountryClick = async (country: string) => {
    // Find the country data based on the selected country name
    const countryData = countries.find((c) => c.name === country);

    if (countryData) {
      const data: UserCountry = {
        name: countryData.name,
        code: countryData.code,
        city: "",
        region: ""
      };
      try {
        // Send a POST request to your API endpoint to set the cookie
        const response = await axios.post("/user-country-cookies", {
          userCountry: data
        });

        if (response.data) {
          router.refresh();
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data.message
        });
      }
    }
  };
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <div className="flex items-center h-11 cursor-pointer">
        <span className="mr-0.5  h-[33px] grid place-items-center">
          <span className={`fi fi-${userCountry.code.toLowerCase()}`} />
        </span>
        <div className="ml-1">
          <span className="block text-xs text-seconborder-secondary leading-3 mt-2">
            {userCountry.name}/EN/
          </span>
          <b className="text-xs font-bold text-seconborder-secondary ">
            USD
            <span className="text-seconborder-secondary scale-[60%] align-middle inline-block">
              <ChevronDown />
            </span>
          </b>
        </div>
      </div>
      {/* Content */}
      <div className="absolute hidden top-0 group-hover:block cursor-pointer">
        <div className="relative mt-12 -ml-32 w-[300px]  bg-secondary rounded-[24px] text-primary pt-2 px-6 pb-6 z-50 shadow-lg">
          {/* Triangle */}
          <div className="w-0 h-0 absolute -top-1.5 right-24 border-l-[10px] border-l-transparent border-b-[10px] border-secondary border-r-[10px] border-r-transparent" />
          <div className="mt-4 jjtext-xl font-bold">Ship to</div>
          <div className="mt-2">
            <div className="relative text-primary bg-seconborder-secondary rounded-lg">
              <CountrySelector
                id={"countries"}
                open={show}
                onToggle={() => setshow(!show)}
                onChange={(val) => handleCountryClick(val)}
                selectedValue={
                  (countries.find(
                    (option) => option.name === userCountry?.name
                  ) as CountrySelect) || countries[0]
                }
              />
              <div>
                <div className="mt-4 text-xl font-bold">Language</div>
                <div className="relative mt-2.5 h-10 py-0 px-3 border-[1px] border-secondary-foreground/20 rounded-lg  flex items-center cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="align-middle">English</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-primary scale-75" />
                  </span>
                </div>
              </div>
              <div>
                <div className="mt-4 text-xl font-bold">Currency</div>
                <div className="relative mt-2 h-10 py-0 px-3 border-[1px] border-secondary-foreground/20 rounded-lg  flex items-center cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="align-middle">USD (US Dollar)</div>
                  <span className="absolute right-2">
                    <ChevronDown className="text-primary scale-75" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
