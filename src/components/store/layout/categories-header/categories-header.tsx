import { getCategories } from "@/queries/category";
import { getOfferTags } from "@/queries/offer-tag";
import CategoriesHeaderContainer from "./container";

export default async function CategoriesHeader() {
  // Fetch all categories
  const { categories } = await getCategories();

  // Fetch all offer tags
  const { offerTags } = await getOfferTags();
  return (
    <div className="w-full pt-2 pb-3 px-0 bg-gradient-to-r from-primary-light to-primary-shade">
      <CategoriesHeaderContainer categories={categories} offerTags={offerTags} />
    </div>
  );
}
