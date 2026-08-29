import { getSubcategories } from "@/queries/subcategory";
import Contact from "./contact";
import Links from "./links";
import Newsletter from "./newsletter";

export default async function Footer() {
  const { subcategories: subs } = await getSubcategories(undefined, {
    sample: 5
  });
  return (
    <div className="w-full bg-background">
      <Newsletter />
      <div className="max-w-[1430px] mx-auto">
        <div className="p-5">
          <div className="grid md:grid-cols-2 md:gap-x-5">
            <Contact />
            <Links subs={subs} />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-primary-light to-primary-shade px-2 text-secondary-foreground">
        <div className="max-w-[1430px] mx-auto flex items-center h-7 justify-center">
          <span className="text-sm">
            <b>©️GoShop</b> - All Rights Reserved {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
