import { ReviewsOrderType } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  sort: ReviewsOrderType;
  setSort: Dispatch<SetStateAction<ReviewsOrderType>>;
}

const ReviewsSort: FC<Props> = ({ sort, setSort }) => {
  return (
    <div className="group w-[120px]">
      {/* Trigger */}
      <button className="text-main-primary hover:text-primary-light text-sm py-0.5 text-center inline-flex items-center">
        Sort by {sort.orderBy === "latest" ? "Default" : sort.orderBy}
        <ChevronDown className="w-3 ml-1" />
      </button>
      <div className="z-10 hidden absolute bg-secondary shadow w-[120px] group-hover:block">
        <ul className="text-m text-card-foreground">
          <li onClick={() => setSort({ orderBy: "highest" })}>
            <span className="block p-2 text-sm cursor-pointer hover:bg-card">
              Sort by highest
            </span>
          </li>
          <li onClick={() => setSort({ orderBy: "latest" })}>
            <span className="block p-2 text-sm cursor-pointer hover:bg-card">
              Sort by latest
            </span>
          </li>
          <li onClick={() => setSort({ orderBy: "latest" })}>
            <span className="block p-2 text-sm cursor-pointer hover:bg-card">
              Sort by oldest
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewsSort;
