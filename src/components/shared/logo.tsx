// React, Next.js
import Image from "next/image";

// Logo image
import LogoImg from "@/public/assets/icons/logo.png";

interface LogoProps {
  width: string;
  height: string;
}

function Logo({ width, height }: LogoProps) {
  return (
    <div className="z-50 relative aspect-square" style={{ width, height }}>
      <Image
        src={LogoImg}
        alt="GoShop"
        fill={true} //
        className="aspect-square object-contain"
      />
    </div>
  );
}

export default Logo;
