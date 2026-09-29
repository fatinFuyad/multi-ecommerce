import { ProductCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "../cards/product/product-card";

interface Props {
  // products: ProductWithFilteredVariants[];
  products: ProductCardType[];
  title?: string;
  link?: string;
  arrow?: boolean;
}

function ProductList({ products, title, link, arrow }: Props) {
  const Title = () => {
    if (link) {
      <Link href={link} className="h-12">
        <h2 className="text-main-primary text-xl font-bold">
          {title}&nbsp;
          {arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      </Link>;
    } else {
      return (
        <h2 className="text-main-primary text-xl font-bold">
          {title}&nbsp;
          {arrow && <ChevronRight className="w-3 inline-block" />}
        </h2>
      );
    }
  };
  return (
    <div className="relative">
      {title && <Title />}
      {products.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap gap-2 -translate-x-5 w-[cacl(100%+3rem)] sm:w-[calc(100%+1.5rem)]",
            {
              "mt-2": title
            }
          )}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        "No Products."
      )}
    </div>
  );
}

export default ProductList;
