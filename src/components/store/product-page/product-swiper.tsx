"use client";

// React, Next.js
import Image from "next/image";
import { useState } from "react";

// Image zoom
import ImageZoom from "react-image-zooom";

// Utils
import { cn } from "@/lib/utils";

// Types
import { IProductVariant } from "@/models/Product";

type VariantImage = IProductVariant["images"][0];

interface PropsType {
  images: VariantImage[];
  // activeImage: VariantImage;
  // setActiveImage: Dispatch<SetStateAction<VariantImage | null>>;
}

export default function ProductSwiper({ images }: PropsType) {
  // if no images are provided, exit early and don't render anything
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="relative">
      <div className="relative w-full flex flex-col-reverse xl:flex-row gap-2">
        {/* THUMBNAIL IMAGES */}
        <div className="flex flex-wrap xl:flex-col gap-3">
          {images.map((img) => (
            <div
              key={img.url}
              className={cn(
                "w-16 h-16 rounded-md grid place-items-center overflow-hidden border border-muted-foreground cursor-pointer transition-all duration-75 ease-in",
                {
                  "border-background": activeImage ? activeImage._id === img._id : false
                }
              )}
              onMouseEnter={() => setActiveImage(img)}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>
        {/* MAIN IMAGE VIEW */}
        <div className="relative rounded-lg overflow-hidden w-full 2xl:h-[600px] 2xl:w-[600px]">
          <ImageZoom
            src={activeImage ? activeImage.url : ""}
            zoom={200}
            className="!w-full xl:!w-[500px] rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
