import { cn } from "@/lib/utils";
import { PaletteIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface PropsType {
  extractedColors?: string[]; // Extracted Colors (Array of strings)
  colors?: { color: string }[]; // List of selected colors from form
  setColors: Dispatch<SetStateAction<{ color: string }[]>>; // Setter function for colors
}

// Color-Palette component for display colors
export default function ColorPalette({ colors, extractedColors, setColors }: PropsType) {
  // State to track the active color
  const [activeColor, setActiveColor] = useState<string>("");

  // Handle Selecting/ Adding color to product colors
  function handleAddColor(color: string) {
    if (!color || !setColors) return;
    // Ensure currentColors is not undefined, defaulting to an empty array if it is
    let currentColors = colors ?? [];
    // Check if the color already exists in currentColors
    const existingColor = currentColors.find((colorItem) => colorItem.color === color);
    if (existingColor) return;

    // Check for empty color inputs and remove them
    currentColors = currentColors.filter((colorItem) => colorItem.color !== "");
    currentColors.push({ color });
    setColors(currentColors);
  }

  // Color component for individual color block
  const Color = ({ color }: { color: string }) => {
    return (
      <div
        className="relative size-10 cursor-pointer transition-all duration-100 ease-linear hover:scale-125 hover:duration-300"
        style={{ backgroundColor: color }}
        onMouseEnter={() => setActiveColor(color)}
        onClick={() => handleAddColor(color)}
      >
        {/* color label */}
        <p className="absolute -top-4 -left-1 text-[10px] font-semibold  text-black">
          {color}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full px-4 rounded-b-md">
      {/* Color palette container */}
      <div className="w-full px-1 py-2 flex flex-col gap-4 rounded-md bg-white">
        {/* Active color display */}
        <div className="relative h-8 flex justify-center bg-white rounded-t-md">
          {/* Active color circle */}
          <div
            className={cn(
              "absolute size-12 -top-6 grid place-content-center rounded-full",
              { "animate-spin": activeColor }
            )}
            style={{ backgroundColor: activeColor || "#fff" }}
          >
            {/* Spinner icon */}
            <PaletteIcon fill={activeColor ? "#fff" : "#000"} />
          </div>
        </div>
        {/* Color blocks */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Map over colors to display color blocks */}
          {extractedColors?.map((color, index) => (
            <Color key={index} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
      
  
    
 */
