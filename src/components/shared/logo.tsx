// React, Next.js
import Image from "next/image";

// Logo image
import LogoImg from "@/public/assets/icons/logo.png";
import Link from "next/link";

interface LogoProps {
  width: string;
  height: string;
}

function Logo({ width, height }: LogoProps) {
  return (
    <div className="z-50 relative aspect-square" style={{ width, height }}>
      <Link href={"/"}>
        <Image
          src={LogoImg}
          alt="GoShop"
          fill={true}
          priority
          sizes="30%"
          className="aspect-square object-contain"
        />
      </Link>
    </div>
  );
}

export default Logo;
