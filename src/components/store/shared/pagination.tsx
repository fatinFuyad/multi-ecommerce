"use client";

import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMemo } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

type PageItem = number | "...";

/**
 * @description The algorithm:
 * 1. Always includes the first and last pages.
 * 2. Includes siblingCount pages on either side of the current page.
 * 3. Inserts an ellipsis when a gap contains multiple hidden pages.
 * 4. Includes the missing page directly when the gap is exactly one page.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}: PaginationProps) {
  const pages = useMemo<PageItem[]>(() => {
    if (totalPages <= 0) return [];

    const current = Math.min(Math.max(1, currentPage), totalPages);

    const range: number[] = [];
    // currentPage=5, totalPage=20,
    for (let i = 1; i <= totalPages; i++) {
      if (
        // [firstPage, 4, 5, 6, lastPage] always in the range
        i === 1 ||
        i === totalPages ||
        (i >= current - siblingCount && i <= current + siblingCount)
      ) {
        range.push(i);
      }
    }

    const result: PageItem[] = [];

    for (let i = 0; i < range.length; i++) {
      const page = range[i]; // 5
      const previous = range[i - 1]; // 4

      if (previous !== undefined) {
        const gap = page - previous; // 1

        if (gap === 2) {
          result.push(previous + 1); // 5
        } else if (gap > 2) {
          result.push("...");
        }
      }

      result.push(page);
    }

    return result;
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(1, currentPage), totalPages);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages || page === current) {
      return;
    }
    onPageChange(page);
    const rect = document.getElementById("productReveiwCards")?.getBoundingClientRect();
    scrollTo({
      behavior: "smooth",
      top: Math.abs(rect?.top || 100) + 1000
    });
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1"
    >
      <Button
        variant={"outline"}
        onClick={() => goToPage(current - 1)}
        disabled={current === 1}
        aria-label="Go to previous page"
      >
        <ChevronsLeft className="w-3 mr-2" /> <span>Previous</span>
      </Button>
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 min-w-9 items-center justify-center"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <Button
            size={"sm"}
            variant={"outline"}
            key={page}
            className={`${
              current === page
                ? "border-blue-600 bg-primary text-secondary-foreground"
                : "hover:bg-background border-muted-foreground"
            }`}
            onClick={() => goToPage(page)}
            aria-label={`Go to page ${page}`}
            aria-current={current === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant={"outline"}
        onClick={() => goToPage(current + 1)}
        disabled={current === totalPages}
        aria-label="Go to next page"
      >
        <span>Next</span> <ChevronsRight className="w-3 ml-2" />
      </Button>
    </nav>
  );
}
