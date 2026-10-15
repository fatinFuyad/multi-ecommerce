import {
  InferSchemaWithId,
  InterfaceFromSchema,
  MergeType,
  PartialSchema
} from "@/lib/types";
import { model, models, Schema } from "mongoose";

// REVIEW IMAGE SCHEMA DEFINITION
const reviewImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String, default: "ReviewImg" }
});
// Types
export type IReviewImage = InterfaceFromSchema<
  InferSchemaWithId<typeof reviewImageSchema>
>;

// REVIEW SCHEMA DEFINITION
const reviewSchema = new Schema(
  {
    variantName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: String, required: true },
    likes: { type: Number, default: 0 },
    images: [reviewImageSchema],
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" }
  },
  { timestamps: true }
);

// INDEXING
reviewSchema.index({ user: "asc" });
reviewSchema.index({ product: "asc" });

// Types
export type ReviewSchema = InferSchemaWithId<typeof reviewSchema>;
export type IReview = InterfaceFromSchema<ReviewSchema>;
export type ReviewRawSchema = MergeType<
  PartialSchema<ReviewSchema, "_id" | "createdAt" | "updatedAt" | "likes">,
  {
    images: {
      url: string;
      alt?: string;
    }[];
  }
>;

// MODEL
const Review = models.Review || model("Review", reviewSchema);
export default Review;
