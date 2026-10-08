"use client";

import {
  ReviewsFiltersType,
  ReviewsOrderType,
  ReviewStatistics,
  ReviewWithUser
} from "@/lib/types";
import { FC, useEffect, useState } from "react";

import { getProductFilteredReviews } from "@/services/product";
import RatingCard from "@/store/cards/product-rating";
import RatingStatisticsCard from "@/store/cards/rating-statistics";
import ReviewCard from "@/store/cards/review";
import Paginaion from "../../shared/pagination";
import ReviewsFilters from "./filters";
import ReviewsSort from "./sort";

interface Props {
  productId: string;
  ratingAvg: number;
  statistics: ReviewStatistics;
  reviews: ReviewWithUser[];
}

const ProductReviews: FC<Props> = ({ productId, reviews, ratingAvg, statistics }) => {
  const { totalReviews, ratingStatistics } = statistics;
  const [productReviews, setProductReviews] = useState<ReviewWithUser[]>(reviews);
  const half = Math.ceil(productReviews.length / 2);

  // Filtering
  const [filters, setFilters] = useState<ReviewsFiltersType>({
    rating: undefined,
    hasImages: undefined
  });

  // Sorting
  const [sort, setSort] = useState<ReviewsOrderType>({ orderBy: "latest" });

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  useEffect(() => {
    async function handleGetReviews() {
      const res = await getProductFilteredReviews(productId, {
        filter: filters,
        sort:
          sort.orderBy === "latest"
            ? "-createdAt"
            : sort.orderBy === "oldest"
              ? "createdAt"
              : "-rating",
        page: `${page}`,
        limit: pageSize + ""
      });
      setProductReviews(res);
    }

    // if (filters.rating || filters.hasImages || sort) {
    if (filters.rating || filters.hasImages) {
      setPage(1);
      handleGetReviews();
      return;
    }
    if (page) {
      handleGetReviews();
      return;
    }
  }, [filters, sort, page, pageSize, productId]);

  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">
          Custom Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full">
        <div className="flex items-center gap-4">
          <RatingCard ratingAvg={ratingAvg} />
          <RatingStatisticsCard statistics={ratingStatistics} />
        </div>
      </div>
      {totalReviews > 0 && (
        <>
          <div className="space-y-6">
            <ReviewsFilters
              filters={filters}
              setFilters={setFilters}
              setSort={setSort}
              stats={statistics}
            />
            <ReviewsSort sort={sort} setSort={setSort} />
          </div>
          {/* Reviews */}
          <div className="mt-6 min-h-72 grid grid-cols-2 gap-4">
            {productReviews.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {productReviews.slice(0, half).map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {productReviews.slice(half).map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              <>No Reviews.</>
            )}
          </div>
          {productReviews.length >= pageSize && (
            <Paginaion
              page={page}
              totalPages={
                filters.rating || filters.hasImages
                  ? productReviews.length / pageSize
                  : totalReviews / pageSize
              }
              setPage={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductReviews;
