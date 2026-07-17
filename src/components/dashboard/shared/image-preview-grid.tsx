import { cn, getDominantColors } from "@/lib/utils";
import NoProductImg from "@/public/assets/images/no_image_2.png";
import { Trash } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ColorPalette from "./color-palette";

interface PropsType {
  images: { url: string }[];
  colors: { color: string }[];
  onRemove: (value: string) => void;
  setColors: Dispatch<SetStateAction<{ color: string }[]>>;
}

function ImagePreviewGrid({ images, colors, setColors, onRemove }: PropsType) {
  const imgLength = images.length;

  // extract color from images
  const [colorPalettes, setColorPalettes] = useState<string[][]>([]);

  useEffect(() => {
    async function fetchColors() {
      // const palettes = await Promise.all(
      //   images.map(async (img) => {
      //     try {
      //       return getDominantColors(img.url);
      //     } catch {
      //       return [];
      //     }
      //   })
      // );
      const palettes = await Promise.allSettled<string[]>(
        images.map((img) => getDominantColors(img.url))
      ).then((results) => {
        return results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
      });

      setColorPalettes(palettes);
    }
    if (imgLength > 0) fetchColors();
  }, [images, imgLength]);

  console.log(colorPalettes);

  // If there are no images, display a placeholder image
  if (imgLength === 0) {
    return (
      <div>
        <Image src={NoProductImg} alt="No product" width={280} height={280} />
      </div>
    );
  }

  // If there are images, display the images in a grid
  return (
    <div className="grid grid-cols-3 w-full auto-rows-[280px] overflow-hidden bg-muted rounded-md gap-x-2 gap-y-2">
      {images.map((img, i) => {
        return (
          <div
            key={i}
            className={cn("relative w-full group border border-gray-300")}
          >
            <Image
              src={img.url}
              alt="product_image"
              width={280}
              height={280}
              className="object-cover object-center h-full w-full"
            />
            {/* Actions */}
            <div
              className={cn(
                "absolute inset-0 hidden group-hover:flex group-hover:bg-muted/50 cursor-pointer  items-center justify-center flex-col gap-y-3 transition-all duration-1000"
              )}
            >
              {/* Color palette (Extract colors) */}
              <ColorPalette
                colors={colors}
                setColors={setColors}
                extractedColors={colorPalettes[i]}
              />
              {/* Delete Button */}
              <button
                className="Btn bg-red-8"
                type="button"
                onClick={() => onRemove(img.url)}
              >
                <span className="sign">
                  <Trash size={16} />
                </span>
                <span className="text">Delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ImagePreviewGrid;
