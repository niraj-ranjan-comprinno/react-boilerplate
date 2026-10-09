import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** Current 1-based page number. */
  page: number;
  /** Items per page. */
  pageSize: number;
  /** Total number of items. */
  total: number;
  /** Called with the new page number on navigation. */
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Molecule: Accessible pagination controls.
 *
 * Composes `Button` atoms. Shows prev/next arrows and up to 5 numbered
 * pages with ellipsis when the range is large.
 *
 * @example
 * <Pagination
 *   page={currentPage}
 *   pageSize={10}
 *   total={totalCount}
 *   onPageChange={setCurrentPage}
 * />
 */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build visible page range (max 5 pages shown)
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const pageBtn = (p: number, current: boolean) => (
    <Button
      key={p}
      variant={current ? "primary" : "outline"}
      size="sm"
      className="h-8 min-w-[2rem] px-2.5"
      aria-label={`Page ${p}`}
      aria-current={current ? "page" : undefined}
      onClick={() => onPageChange(p)}
    >
      {p}
    </Button>
  );

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className
      )}
    >
      {/* Item range summary */}
      <p className="shrink-0 text-xs text-muted-foreground">
        {total === 0
          ? "No results"
          : `Showing ${from}–${to} of ${total}`}
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          aria-label="Go to previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* First page + ellipsis */}
        {start > 1 && (
          <>
            {pageBtn(1, false)}
            {start > 2 && (
              <span className="px-1 text-xs text-muted-foreground select-none">
                …
              </span>
            )}
          </>
        )}

        {/* Visible page buttons */}
        {pages.map((p) => pageBtn(p, p === page))}

        {/* Ellipsis + last page */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-1 text-xs text-muted-foreground select-none">
                …
              </span>
            )}
            {pageBtn(totalPages, false)}
          </>
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          aria-label="Go to next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
