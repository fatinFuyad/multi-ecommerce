import countries from "@/data/countries.json";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import ColorThief from "colorthief";
import { twMerge } from "tailwind-merge";
import { CountryIPInfo, MergeType, UserCountry } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to grid grid classnames dependng on length
export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

/**
 * @description get the country of the user with ip info
 * @returns userCountry
 */
export async function getUserCountry(): Promise<UserCountry> {
  let userCountry: UserCountry = {
    name: "Bangladesh",
    city: "Dhaka",
    code: "BD",
    region: "Mirpur"
  };

  try {
    const { data } = await axios.get<CountryIPInfo>(
      `https://ipinfo.io/?token=${process.env.IPINFO_TOKEN}`
    );

    const countryName = countries.find((cntry) => cntry.code === data.country)!.name;
    userCountry = {
      name: countryName,
      code: data.country,
      city: data.city,
      region: data.region
    };
  } catch (error) {
    // Log error if necessary but do not throw
    console.error("Failed to fetch IP info", error);
  }
  return userCountry;
}
