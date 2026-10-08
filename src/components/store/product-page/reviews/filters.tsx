import { ReviewsFiltersType, ReviewsOrderType, ReviewStatistics } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  filters: ReviewsFiltersType;
  stats: ReviewStatistics;
  setFilters: Dispatch<SetStateAction<ReviewsFiltersType>>;
  setSort: Dispatch<SetStateAction<ReviewsOrderType>>;
}

const ReviewsFilters: FC<Props> = ({ filters, setFilters, setSort, stats }) => {
  const { rating, hasImages } = filters;
  const { ratingStatistics, totalReviewsWithImages, totalReviews } = stats;
  return (
    <div className="mt-8 relative overflow-hidden">
      <div className="flex flex-wrap gap-4">
        {/* All */}
        <div
          className={cn(
            "bg-secondary text-main-primary border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-primary-light text-primary-mid border-primary-mid":
                !rating && !hasImages
            }
          )}
          onClick={() => {
            setFilters({ rating: undefined, hasImages: undefined });
            setSort({ orderBy: "latest" });
          }}
        >
          All ({totalReviews})
        </div>
        {/* Include Images */}
        <div
          className={cn(
            "bg-secondary text-main-primary border border-transparent rounded-full cursor-pointer py-1.5 px-4",
            {
              "bg-primary-light text-primary-mid border-primary-mid": hasImages
            }
          )}
          onClick={() => setFilters({ ...filters, hasImages: true })}
        >
          Include Images ({totalReviewsWithImages})
        </div>
        {/* Rating Filters */}
        {ratingStatistics.map((r) => (
          <div
            key={r.rating}
            className={cn(
              "bg-secondary text-main-primary border border-transparent rounded-full cursor-pointer py-1.5 px-4",
              {
                "bg-primary-light text-primary-mid border-primary-mid":
                  r.rating === rating
              }
            )}
            onClick={() => setFilters({ ...filters, rating: r.rating })}
          >
            {r.rating} stars ({r.numReviews})
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsFilters;
