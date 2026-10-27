import { InferSchemaWithId, InterfaceFromSchema, PartialSchema } from "@/lib/types";
import { HydratedDocument, model, models, Schema } from "mongoose";

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

// DEFAULT SCHEMA TYPE
export type OfferTagSchema = InferSchemaWithId<typeof offerTagSchema>;

// USE FOR THE RETURNED DATA FROM API RESPONSE
export type IOfferTag = InterfaceFromSchema<OfferTagSchema>;

// THE MONGOOSE HYDRATED DOCUMENT
export type OfferTagDoc = HydratedDocument<OfferTagSchema>;

// USE FOR CREATING NEW DOCUMENT
export type OfferTagRawSchema = PartialSchema<
  OfferTagSchema,
  "createdAt" | "updatedAt" | "_id"
>;

const OfferTag = models.OfferTag || model("OfferTag", offerTagSchema);

export default OfferTag;
