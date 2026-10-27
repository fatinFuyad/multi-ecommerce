"use client";

import {
  ReviewsFiltersType,
  ReviewsSortType,
  ReviewStatistics,
  ReviewWithUser
} from "@/lib/types";
import { IProductVariant } from "@/models/Product";
import { FC, useEffect, useState } from "react";

import { getProductFilteredReviews } from "@/services/review";
import RatingCard from "@/store/cards/product-rating";
import RatingStatisticsCard from "@/store/cards/rating-statistics";
import ReviewCard from "@/store/cards/review";
import ReviewDetails from "../../forms/review-details";
import Pagination from "../../shared/pagination";
import ReviewsFilters from "./filters";
import ReviewsSort from "./sort";

interface Props {
  productId: string;
  averageRating: number;
  statistics: ReviewStatistics;
  reviews: ReviewWithUser[];
  variants: IProductVariant[];
}

const sortOrder: Record<ReviewsSortType, string> = {
  latest: "-createdAt",
  oldest: "createdAt",
  highest: "-rating",
  index: "-index"
};

const ProductReviews: FC<Props> = ({
  productId,
  reviews,
  averageRating,
  statistics,
  variants
}) => {
  const { totalReviews, ratingStatistics } = statistics;
  const [productReviews, setProductReviews] = useState<ReviewWithUser[]>(reviews);
  const half = Math.ceil(productReviews.length / 2);

  // Filtering
  const [filters, setFilters] = useState<ReviewsFiltersType>({
    rating: undefined,
    hasImages: undefined
  });

  // Sorting
  const [sort, setSort] = useState<ReviewsSortType | null>(null);

  // Pagination
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  async function handleGetReviews() {
    const reviewRes = await getProductFilteredReviews(productId, {
      filter: filters,
      sort: sort ? sortOrder[sort] : "-createdAt",
      page: `${page}`,
      limit: pageSize + ""
    });

    setProductReviews(reviewRes.reviews);
    setTotalPages(reviewRes.pageMetadata.totalPages);
  }

  useEffect(() => {
    if (filters.rating || filters.hasImages || sort) {
      setPage(1);
      handleGetReviews();
      return;
    }
  }, [filters, sort]);

  useEffect(() => {
    if (page) {
      handleGetReviews();
      return;
    }
  }, [page]);

  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">
          Custom Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full" id="ratingStatistics">
        <div className="flex items-center gap-4">
          <RatingCard averageRating={averageRating} />
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
          <div className="mt-6 min-h-72 grid grid-cols-2 gap-4" id="productReveiwCards">
            {productReviews.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {productReviews.slice(0, half).map((review, i) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {productReviews.slice(half).map((review, i) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              <>No Reviews.</>
            )}
          </div>
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
      <div className="mt-10">
        <ReviewDetails
          productId={productId}
          variants={variants}
          setReviews={setProductReviews}
          reviews={productReviews}
        />
      </div>
    </div>
  );
};

export default ProductReviews;
