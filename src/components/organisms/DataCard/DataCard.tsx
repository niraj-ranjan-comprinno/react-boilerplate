import { Spinner } from "@/components/atoms/spinner";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card } from "@/components/atoms/card";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@/types/components";

export interface DataCardProps<T extends Record<string, unknown>> {
  /** Card title shown in the header. */
  title: string;
  /** Optional subtitle / description. */
  description?: string;
  /** Column definitions for the table. */
  columns: ColumnDef<T>[];
  /** Rows to render. */
  data: T[];
  /** Key prop extractor — used for React `key`. */
  keyExtractor: (row: T) => string;
  /** Whether data is currently loading. */
  isLoading?: boolean;
  /** Error message to display. */
  error?: string;
  /** Content rendered right-aligned in the header. */
  headerActions?: React.ReactNode;
  /** Content rendered in the card footer (e.g. Pagination). */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Organism: Data table inside a Card.
 *
 * Handles loading, empty, and error states consistently.
 * Accepts typed `ColumnDef` for columns and generic row data.
 *
 * @example
 * <DataCard
 *   title="Payments"
 *   columns={[{ accessor: "email", header: "Email" }, { accessor: "amount", header: "Amount" }]}
 *   data={payments}
 *   keyExtractor={(r) => r.id}
 *   footer={<Pagination page={page} pageSize={10} total={total} onPageChange={setPage} />}
 * />
 */
export function DataCard<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  keyExtractor,
  isLoading = false,
  error,
  headerActions,
  footer,
  className,
}: DataCardProps<T>) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <Card.Header>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex shrink-0 items-center gap-2">{headerActions}</div>
          )}
        </div>
      </Card.Header>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label={title}>
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Spinner size="sm" />
                    <span className="text-sm">Loading…</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Error */}
            {!isLoading && error && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <p className="text-sm text-destructive">{error}</p>
                </td>
              </tr>
            )}

            {/* Empty */}
            {!isLoading && !error && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No results.</p>
                </td>
              </tr>
            )}

            {/* Rows */}
            {!isLoading &&
              !error &&
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/40"
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.accessor)}
                      className="px-6 py-3 text-foreground"
                    >
                      {col.render
                        ? col.render(row[col.accessor as keyof T], row)
                        : String(row[col.accessor as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {footer && <Card.Footer>{footer}</Card.Footer>}
    </Card>
  );
}

/** Skeleton variant — drop-in replacement while awaiting data. */
export function DataCardSkeleton({
  rows = 5,
  cols = 4,
  title,
  className,
}: {
  rows?: number;
  cols?: number;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <Card.Header>
        <Skeleton className="h-5 w-40 rounded" />
        {title && <p className="sr-only">{title} loading</p>}
      </Card.Header>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <Skeleton className="h-3 w-20 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, ri) => (
              <tr key={ri} className="border-b border-border/50 last:border-0">
                {Array.from({ length: cols }).map((_, ci) => (
                  <td key={ci} className="px-6 py-3">
                    <Skeleton className={cn("h-4 rounded", ci === 0 ? "w-32" : "w-16")} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
