import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

// hooks/useQueryParams.ts
export const useQueryParams = (
  formValues: any,
  columnFilters: ColumnFiltersState,
  pagination: PaginationState,
  sorting: SortingState
): BaseQueryableQuery => {
  const filterParams: Record<string, any> = {};

  columnFilters.forEach((filter) => {
    filterParams[filter.id] = filter.value;
  });

  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.every((v) => typeof v === "boolean")) {
        filterParams[key] = value;
      } else if (typeof value === "object" && value !== null) {
        filterParams[key] = JSON.stringify(value);
      } else {
        filterParams[key] = value;
      }
    }
  });

  return {
    isPagination: true,
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortField: sorting[0]?.id || "CreatedDate",
    sortOrder: sorting[0]?.desc ? -1 : 1,
    fromDate: formValues?.date?.from?.toISOString() || null,
    toDate: formValues?.date?.to?.toISOString() || null,
    ...filterParams,
  };
};
