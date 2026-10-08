"use client";

import ReactStars from "react-rating-stars-component";

export default function RatingCard({ ratingAvg }: { ratingAvg: number }) {
  const fixed_rating = Number(ratingAvg.toFixed(2));
  return (
    <div className="h-44 flex-1">
      <div className="p-6 bg-secondary flex flex-col h-full justify-center overflow-hidden rounded-lg">
        <div className="text-6xl font-bold">{ratingAvg}</div>
        <div className="py-1.5">
          <ReactStars
            count={5}
            value={fixed_rating}
            size={24}
            color="#969fa0"
            isHalf
            edit={false}
          />
        </div>
        <div className="text-[#03c97a] leading-5 mt-2">All from verified purchases</div>
      </div>
    </div>
  );
}
