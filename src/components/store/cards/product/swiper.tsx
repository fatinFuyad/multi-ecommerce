//React, Nextjs
import Image from "next/image";

// Import Swiper React components
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// @ts-expect-error: undeclared css module
import "swiper/css";
//import "swiper/css/pagination";
//import "swiper/css/navigation";

// Types
import { IProductVariant } from "@/models/Product";
import { useEffect, useRef } from "react";

export default function ProductCardImageSwiper({
  images
}: {
  images: IProductVariant["images"];
}) {
  const swiperRef = useRef<any>(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, [swiperRef]);
  return (
    <div
      className="relative mb-2 w-full h-[200px] bg-background contrast-[90%] rounded-2xl overflow-hidden"
      onMouseEnter={() => swiperRef.current.swiper.autoplay.start()}
      onMouseLeave={() => {
        swiperRef.current.swiper.autoplay.stop();
        swiperRef.current.swiper.slideTo(0);
      }}
    >
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 500 }}>
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <Image
              src={img.url}
              alt=""
              width={400}
              height={400}
              className="block object-cover h-[200px] w-48 sm:w-52"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
