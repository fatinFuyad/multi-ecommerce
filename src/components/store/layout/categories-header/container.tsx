"use client";

import { ICategory } from "@/models/Category";
import { IOfferTag } from "@/models/OfferTag";
import { useState } from "react";
import CategoriesMenu from "./categories-menu";
import OfferTagsLinks from "./offerTags-links";

export default function CategoriesHeaderContainer({
  categories,
  offerTags
}: {
  categories: ICategory[];
  offerTags: IOfferTag[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      {/* Category menu */}
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />
      {/* Offer tags links */}
      <OfferTagsLinks offerTags={offerTags} open={open} />
    </div>
  );
}
