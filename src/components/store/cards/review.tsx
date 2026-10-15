"use client";

import ColorWheel from "@/components/shared/color-wheel";
import { ReviewWithUser } from "@/lib/types";
import { formatDate } from "date-fns";
import Image from "next/image";
import ReactStars from "react-rating-stars-component";

export default function ReviewCard({ review }: { review: ReviewWithUser }) {
  const { images, user } = review;
  const colors = review.color
    .split(",")
    .filter((color) => color.trim() !== "") // Remove any empty strings
    .map((color) => ({ color: color.trim() }));

  const nameSplit = user.name.split(" ");
  const cesnoredName =
    nameSplit.length >= 2 ? nameSplit[0] + " " + nameSplit[1][0] : nameSplit[0][0];

  return (
    <div className="border border-muted-foreground rounded-xl flex h-fit relative py-4 px-2.5">
      <div className="px-2 space-y-1">
        <Image
          src={user.image || ""}
          alt="Profile image"
          width={100}
          height={100}
          className="w-11 h-11 rounded-full object-cover"
        />
        <p className="text-xs text-secondary-foreground w-20 overflow-hidden whitespace-nowrap text-ellipsis">
          {cesnoredName.toUpperCase()}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(review.createdAt, "MMM-dd-yyyy")}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-between leading-5 overflow-hidden px-1.5">
        <div className="space-y-2">
          <ReactStars
            count={5}
            size={24}
            color="#e0e0e0"
            activeColor="#FFD804"
            value={review.rating}
            isHalf
            edit={false}
          />
          <p>{review.rating}</p>
          <div className="flex items-center gap-x-2">
            <ColorWheel colors={colors} size={24} />
            <p className="text-secondary-foreground text-sm">{review.variantName}</p>
            <span>&mdash;</span>
            <p className="text-secondary-foreground text-sm">{review.size}</p>
            <span>&mdash;</span>
            <p className="text-secondary-foreground text-sm">{review.quantity} PC</p>
          </div>

          <p className="text-sm">{review.review}</p>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
