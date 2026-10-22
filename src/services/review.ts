"use server";

import { auth } from "@/lib/auth";
import { AddReviewSchemaType } from "@/lib/schemas";
import { ReviewWithUser } from "@/lib/types";
import Product from "@/models/Product";
import Review, { ReviewRawSchema, ReviewSchema } from "@/models/Review";
import { Types } from "mongoose";

/**
 * @description Upserts a review into the database, updating if it exists or creating a new one if not. User is not allowed to provide multiple reviews for the same product. In case of multiple reviews, previous one will be overridden by the later one.
 * @access Permission Level: User.
 * @Parameters
 * - productId: ID of the product the review is associated with.
 * - review: Review object containing details of the review to be upserted.
 * @returns Updated or newly created review details.
 */

export const upsertReview = async (productId: string, review: AddReviewSchemaType) => {
  const { user } = await auth();
  // if (!session) return;
  // const { user } = session;

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
