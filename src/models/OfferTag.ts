import { PrettifyType } from "@/lib/types";
import {
  Schema,
  Types,
  InferSchemaType,
  HydratedDocument,
  models,
  model,
  MergeType
} from "mongoose";

const offerTagSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    url: { type: String, required: true },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ]
  },
  {
    timestamps: true
  }
);

// INDEXING FOR OFFER TAG
offerTagSchema.index({ name: "asc" }, { unique: true });
offerTagSchema.index({ url: "asc" }, { unique: true });

export type IOfferTag = InferSchemaType<typeof offerTagSchema> & {
  _id: Types.ObjectId;
};
export type OfferTagDoc = HydratedDocument<IOfferTag>;

// prettier-ignore
export type OfferTagSchema = PrettifyType<
  MergeType<IOfferTag, Partial<
      Pick<IOfferTag, "createdAt"|"updatedAt"|"_id">
  >>>;

const OfferTag = models.OfferTag || model<IOfferTag>("OfferTag", offerTagSchema);

export default OfferTag;
