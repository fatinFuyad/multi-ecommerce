"use client";

import { Headset } from "lucide-react";
import { SocialLogo } from "social-logos";

export default function Contact() {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-x-6">
          <Headset className="scale-[190%] stroke-primary" />
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">
              Got Questions ? Call us 24/7!
            </span>
            <span className="text-xl">(800) 9213-6472 , (800) 7324-1859</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <b>Contact Info</b>
        <span className="text-sm">
          1357 Maple Grove Avenue, Springfield, IL 62704, USA
        </span>
        <div className="flex flex-wap gap-2 mt-4">
          <SocialLogo
            icon="facebook"
            size={28}
            fill="#70a5fa"
            className="cursor-pointer hover:fill-primary-mid hover:scale-125 duration-300"
          />
          <SocialLogo
            icon="whatsapp"
            size={28}
            fill="#70a5fa"
            className="cursor-pointer hover:fill-primary-mid hover:scale-125 duration-300"
          />
          <SocialLogo
            icon="pinterest"
            size={28}
            fill="#70a5fa"
            className="cursor-pointer hover:fill-primary-mid hover:scale-125 duration-300"
          />
          <SocialLogo
            icon="linkedin"
            size={28}
            fill="#70a5fa"
            className="cursor-pointer hover:fill-primary-mid hover:scale-125 duration-300"
          />
          <SocialLogo
            icon="instagram"
            size={28}
            fill="#70a5fa"
            className="cursor-pointer hover:fill-primary-mid hover:scale-125 duration-300"
          />
          <SocialLogo
            icon="youtube"
            size={28}
            fill="#70a5fa"
            className="cursor-pointer hover:fill-primary-mid hover:scale-125 duration-300"
          />
          <SocialLogo
            icon="telegram"
            size={28}
            fill="#70a5fa"
            className="cursor-pointer hover:fill-primary-mid hover:scale-125 duration-300"
          />
        </div>
      </div>
    </div>
  );
}
