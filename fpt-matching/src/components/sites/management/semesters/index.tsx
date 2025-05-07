import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableSkeleton } from "@/components/_common/data-table-api/data-table-skelete";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-query-params";
import { professionService } from "@/services/profession-service";
import { Profession } from "@/types/profession";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { columns } from "./columns";
import { semesterService } from "@/services/semester-service";
import { SemesterGetAllQuery } from "@/types/models/queries/semesters/semester-get-all-query";
import { DataTableSemesterComponent } from "./data-table-custom-component";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
import { FilterEnum } from "@/types/models/filter-enum";
import { isDeleted_options } from "@/lib/filter-options";
import { LoadingComponent } from "@/components/_common/loading-page";

const defaultSchema = z.object({
  semesterName: z.string().optional(),
});

export default function SemesterTable() {
  const searchParams = useSearchParams();
  const filterEnums: FilterEnum[] = [
    { columnId: "isDeleted", title: "Trạng thái", options: isDeleted_options },
  ];

  //#region State Management
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isTyping, setIsTyping] = useState(false);
  //#endregion

  //#region Form and Table Setup
  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
  });

  const [inputFields, setInputFields] = useState<z.infer<typeof defaultSchema>>();

  const queryParams = useMemo(() => {
    const params: SemesterGetAllQuery = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );
    return { ...params };
  }, [inputFields, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || inputFields) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [columnFilters, inputFields]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => semesterService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-4 text-center">
          <TypographyH2>Error loading data</TypographyH2>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns,
    pageCount: data?.data?.totalPages ?? 0,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });
  //#endregion

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    setInputFields(values);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <TypographyH2>Quản lý học kỳ</TypographyH2>
        {/* Add create button if needed */}
        {/* <Button variant="default">
          Thêm học kỳ mới
        </Button> */}
      </div>

      {/* Search Card */}
      <Card className="p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="semesterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Tìm kiếm theo tên kì</FormLabel>
                  <div className="flex items-center gap-2 mt-2">
                    <FormControl>
                      <Input
                        placeholder="Nhập tên học kỳ..."
                        className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <Button 
                      type="submit" 
                      variant="default" 
                      size="icon"
                      className="shrink-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>

      {/* Table Section */}
      <Card className="p-6 shadow-sm">
        <div className="space-y-4">
          <DataTableToolbar
            form={form}
            table={table}
            filterEnums={filterEnums}
            isSelectColumns={false}
            isSortColumns={false}
          />

          {isFetching ? (
            <div className="flex justify-center items-center h-64">
              <LoadingComponent />
            </div>
          ) : (
            <>
              <DataTableSemesterComponent
                table={table}
                restore={semesterService.restore}
                deletePermanent={semesterService.deletePermanent}
              />
              
              <div className="mt-4">
                <DataTablePagination table={table} />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}