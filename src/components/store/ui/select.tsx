"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  name: string;
  value: string;
  placeholder?: string;
  subPlaceholder?: string;
  onChange: (value: string) => void;
  options: { name: string; value: string; image?: string; colors?: string }[];
}

const Select: React.FC<Props> = ({
  name,
  onChange,
  placeholder,
  options,
  value,
  subPlaceholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState(
    options.find((o) => o.value === value)
  );

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option click
  const handleOptionClick = (option: string) => {
    onChange(option); // Update the form value
    setActiveVariant(options.find((o) => o.value === option));
    setIsOpen(false); // Close the dropdown after selection
  };
  return (
    <div>
      <div className="relative w-full">
        <div color={activeVariant?.colors || ""}>
          <div className="relative">
            {activeVariant?.image && (
              <Image
                src={activeVariant.image}
                alt=""
                width={50}
                height={50}
                className="absolute h-10 w-10 rounded-full top-1/2 -translate-y-1/2 left-2 shadow-md object-top object-cover"
              />
            )}
            <input
              className={cn(
                "w-full peer z-[21] pr-6 pl-14 py-4 rounded-xl outline-none duration-200 ",
                {
                  "ring-2 ring-[transparent] focus:ring-primary-mid":
                    !activeVariant?.colors
                }
              )}
              color="white"
              placeholder={placeholder}
              value={value} // Bind the value to form value
              onFocus={toggleDropdown} // Show dropdown on focus
              onBlur={() => setIsOpen(false)} // Close dropdown on blur
              onChange={(e) => onChange(e.target.value)} // Update form value on input change
            />
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-16 w-full z-[500] left-0 rounded-xl border border-white-222 p-4 bg-background shadow-lg">
            <p className="font-semibold text-xs text-muted-foreground">
              {subPlaceholder}
            </p>
            <ul className="flex gap-2 flex-col mt-2">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="flex items-center gap-x-2 px-2 cursor-pointer text-sm hover:bg-primary-shade py-2 rounded-lg"
                  onMouseDown={() => handleOptionClick(option.value)} // Handle option click without triggering blur
                >
                  {option.image && (
                    <Image
                      src={option.image}
                      alt=""
                      width={100}
                      height={100}
                      className=" h-10 w-10 rounded-full shadow-md object-top object-cover"
                    />
                  )}
                  {option.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
