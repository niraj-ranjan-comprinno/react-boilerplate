/**
 * Shared component prop types used across multiple components.
 * Adapted from the Next.js reference boilerplate.
 */

/** Standard sizes used across UI components. */
export type ComponentSize = "sm" | "md" | "lg" | "xl";

/** Standard variants for feedback / status. */
export type StatusVariant = "success" | "error" | "warning" | "info";

/** Standard color variants mapped to the design system. */
export type ColorVariant = "primary" | "secondary" | "danger" | "ghost";

/** Placement options for floating elements. */
export type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end";

/** Base props shared by all components. */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/** Props for components that can be toggled open/closed. */
export interface ToggleableProps {
  isOpen: boolean;
  onToggle: () => void;
}

/** Props for components with controlled selection. */
export interface SelectableProps<T = string> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

/** Props for form-connected components. */
export interface FormFieldProps {
  name?: string;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Column definition for table / data-table components. */
export interface ColumnDef<T = Record<string, unknown>> {
  accessor: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

/** Pagination state. */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

/** Sort state for tables. */
export interface SortState {
  column: string;
  direction: "asc" | "desc";
}

/** Chart data point. */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/** Navigation item used in sidebar, menus, etc. */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  children?: NavigationItem[];
}
