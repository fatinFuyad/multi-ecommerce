"use client";

import { ReviewStatistics } from "@/lib/types";
import ReactStars from "react-rating-stars-component";

export default function RatingStatisticsCard({
  statistics
}: {
  statistics: ReviewStatistics["ratingStatistics"];
}) {
  return (
    <div className="h-44 flex-1">
      <div className="py-5 px-7 bg-secondary flex flex-col gap-y-2 h-full justify-center overflow-hidden rounded-lg">
        {statistics
          .slice()
          .reverse()
          .map((stat) => (
            <div key={stat.rating} className="flex items-center h-4">
              <ReactStars
                count={5}
                value={stat.rating}
                size={15}
                color="#9ea7ac"
                isHalf
                edit={false}
              />
              <div className="relative w-full flex-1 h-1.5 mx-2.5 bg-muted-foreground rounded-full">
                <div
                  className="absolute left-0 h-full rounded-full bg-yellow-500"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
              <div className="text-xs w-12 leading-4">{stat.numReviews}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
