import { cn } from "@/lib/utils";
import { IOfferTag as OfferTag } from "@/models/OfferTag";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

interface breakpoint {
  name: string;
  query: string;
  value: number;
}

const breakpoints: breakpoint[] = [
  { name: "isPhoneScreen", query: "(max-width: 640px)", value: 2 }, // mobile devices
  { name: "isSmallScreen", query: "(min-width: 640px)", value: 3 }, // sm
  { name: "isMediumScreen", query: "(min-width: 768px)", value: 4 }, // md
  { name: "isLargeScreen", query: "(min-width: 1024px)", value: 6 }, // lg
  // { name: "isXLargeScreen", query: "(min-width: 1280px)", value: 6 }, // xl
  { name: "is2XLargeScreen", query: "(min-width: 1536px)", value: 7 } // 2xl
];

function MediaQuery(bp: breakpoint) {
  const match = useMediaQuery({ query: bp.query });
  return match;
}

export default function OfferTagsLinks({
  offerTags,
  open
}: {
  offerTags: OfferTag[];
  open: boolean;
}) {
  const splitPoint = breakpoints.reduce((acc, bp) => {
    const matches = MediaQuery(bp);
    return matches ? bp.value : acc;
  }, 1);

  return (
    <div className="relative w-fit">
      <div
        className={cn(
          "flex gap-1 items-center flex-wrap xl:-translate-x-6 transition-all duration-100 ease-in-out",
          {
            "!translate-x-0": open
          }
        )}
      >
        {offerTags.slice(0, splitPoint).map((tag, i) => (
          <Link
            key={i}
            href={`/browse?offer=${tag.url}`}
            className={cn(
              "text-center text-secondary-foreground px-3 py-1 rounded-xl hover:bg-muted-foreground hover:text-secondary",
              {
                "bg-primary/50": i === 0
              }
            )}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
