import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
  } from "@radix-ui/react-icons";
  import { Table } from "@tanstack/react-table";
  
  import { Button } from "@/components/ui/button";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    visiblePageCount?: number;
  }
  
  export function DataTablePagination<TData>({
    table,
    visiblePageCount = 5,
  }: DataTablePaginationProps<TData>) {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
  
    const getVisiblePages = () => {
      let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
      let endPage = startPage + visiblePageCount - 1;
  
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - visiblePageCount + 1);
      }
  
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };
  
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Lựa chọn hàng</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[2,10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
  
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(page - 1)}
              >
                {page}
              </Button>
            ))}
            {totalPages > visiblePageCount && currentPage + Math.floor(visiblePageCount / 2) < totalPages && (
              <span className="px-2">...</span>
            )}
          </div>
  
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }