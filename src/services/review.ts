"use server";

import { ProductPageData, ReviewStatistics, ReviewWithUser } from "@/lib/types";
import { omit } from "@/lib/utils";

import { authenticate } from "@/lib/auth";
import { AddReviewSchemaType } from "@/lib/schemas";
import Product from "@/models/Product";
import Review, { ReviewRawSchema, ReviewSchema } from "@/models/Review";
import { Types } from "mongoose";
import { QueryBuilder } from "@/lib/query-builder";

/**
 * @description Upserts a review into the database, updating if it exists or creating a new one if not. User is not allowed to provide multiple reviews for the same product. In case of multiple reviews, previous one will be overridden by the later one.
 * @access Permission Level: User.
 * @Parameters
 * - productId: ID of the product the review is associated with.
 * - review: Review object containing details of the review to be upserted.
 * @returns Updated or newly created review details.
 */

export const upsertReview = async (productId: string, review: AddReviewSchemaType) => {
  const user = await authenticate();

  // Ensure productId and review data are provided
  if (!productId) throw new Error("Product ID is required.");
  if (!review) throw new Error("Please provide review data.");

  // check for existing review
  const existingReview = await Review.findOne({
    product: productId,
    user: user._id
  }).lean<Pick<ReviewSchema, "_id" | "rating">>();

  const isEditSession = Boolean(existingReview?._id);
  const reviewId = isEditSession ? existingReview!._id : new Types.ObjectId();

  // upsert the review;
  const newReview = await Review.findByIdAndUpdate(
    reviewId,
    {
      ...review,
      _id: reviewId,
      user: new Types.ObjectId(user._id),
      product: new Types.ObjectId(productId)
    } satisfies ReviewRawSchema,
    {
      upsert: true,
      returnDocument: "after"
      // runValidators: true
    }
  ).populate({ path: "user", select: "name image" });

  const rating = isEditSession ? review.rating - existingReview!.rating : review.rating;
  const incRatingCount = isEditSession ? 0 : 1;

  // update the product rating
  await Product.updateOne({ _id: productId }, [
    {
      $set: {
        ratingSum: {
          $add: ["$ratingSum", rating]
        },
        ratingCount: {
          $add: ["$ratingCount", incRatingCount]
        }
      }
    },
    {
      $set: {
        averageRating: {
          $divide: ["$ratingSum", "$ratingCount"]
        }
      }
    }
  ]);

  return JSON.parse(JSON.stringify(newReview)) as ReviewWithUser;
};

export const getReviewStatistics = async (
  productId: string
): Promise<ReviewStatistics> => {
  const ratingStats = await Review.aggregate([
    { $match: { product: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: { $floor: "$rating" },
        reviewCount: {
          $sum: 1
        },
        reviewWithImageCount: {
          $sum: {
            $cond: [{ $gt: [{ $size: "$images" }, 0] }, 1, 0]
          }
        },
        imageCount: {
          $sum: {
            $size: "$images"
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        reviewCount: 1,
        reviewWithImageCount: 1,
        imageCount: 1,
        percentage: {
          $multiply: [{ $divide: ["$reviewWithImageCount", "$reviewCount"] }, 100]
        },
        imageReviewPercentage: {
          $multiply: [
            {
              $divide: ["$reviewWithImageCount", "$reviewCount"]
            },
            100
          ]
        }
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ]);

  const totalReviews = ratingStats.reduce((sum, stat) => sum + stat.reviewCount, 0);
  const totalReviewsWithImages = ratingStats.reduce(
    (sum, stat) => sum + stat.reviewWithImageCount,
    0
  );
  const reviewWithImagesPercentage =
    totalReviews > 0 ? (totalReviewsWithImages / totalReviews) * 100 : 0;
  const ratingStatistics = ratingStats.map((stat) => ({
    rating: stat._id, // rating number
    numReviews: stat.reviewCount,
    percentage: totalReviews > 0 ? (stat.reviewCount / totalReviews) * 100 : 0
  }));

  return {
    ratingStatistics,
    totalReviewsWithImages,
    reviewWithImagesPercentage,
    totalReviews
  };
};

export const getReviews = async (productId: string) => {
  const query = new QueryBuilder(
    Review.find({ product: productId }).populate({
      path: "user",
      select: "_id name image"
    }),
    { limit: "4" }
  )
    .paginate()
    .build();
  const reviews = await query;

  return JSON.parse(JSON.stringify(reviews)) as ProductPageData["reviews"];
};

type QueryOptions = {
  filter: { rating?: number; hasImages?: boolean };
  sort?: string; // '-createdAt', '-rating'
  page?: string; // '2';
  limit?: string; // '10'
  fields?: string; // exp: 'name,price,color'
};

/**
 * @description Retrieves filtered and sorted reviews for a product from the database, based on rating, presence of images, and sorting options.
 * @access Public
 * @param productId The ID of the product for which reviews are being fetched.
 * @param queryOptions An object contains filter, sort, page, limit, fields.
 * - filter: An object containing the filter options such as rating and whether reviews include images.
 * - sort: An object defining the sort order, such as latest, oldest, or highest rating.
 * - page: The page number for pagination (1-based index).
 * - limit: The number of reviews to retrieve per page.
 * - fields: The fileds to incldue in a review.
 * @returns IReview[] A paginated list of reviews that match the filter and sort criteria.
 */
export const getProductFilteredReviews = async (
  productId: string,
  queryOptions: QueryOptions
) => {
  const reviewFilters: any = {};
  if (queryOptions.filter.hasImages) reviewFilters["images.0"] = { $exists: true };
  if (queryOptions.filter.rating)
    reviewFilters.rating = {
      $in: [queryOptions.filter.rating, queryOptions.filter.rating + 0.5]
    };

  const query = new QueryBuilder(
    Review.find({ product: productId, ...reviewFilters }),
    omit(queryOptions, ["filter"])
  )
    .populateDoc({
      populate: "user",
      fields: "user=name,image",
      lean: true
    })
    // .filter()
    .sort()
    .paginate();

  const reviewsData = await query.exec<{ reviews: ReviewWithUser[] }>(
    Review,
    reviewFilters
  );
  return JSON.parse(JSON.stringify(reviewsData)) as typeof reviewsData;
};
