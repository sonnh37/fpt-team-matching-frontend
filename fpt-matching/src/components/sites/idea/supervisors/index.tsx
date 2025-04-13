import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableSkeleton } from "@/components/_common/data-table-api/data-table-skelete";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
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
import { useQueryParams } from "@/hooks/use-query-params";
import { isExistedTeam_options } from "@/lib/filter-options";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus, IdeaType } from "@/types/enums/idea";
import { FilterEnum } from "@/types/models/filter-enum";
import { IdeaGetAllQuery } from "@/types/models/queries/ideas/idea-get-all-query";
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
import { z } from "zod";
import { columns } from "./columns";
import { IdeaGetListOfSupervisorsQuery } from "@/types/models/queries/ideas/idea-get-list-of-supervisor-query";

const defaultSchema = z.object({
  englishName: z.string().optional(),
});

export default function IdeasOfSupervisorsTableTable() {
  const searchParams = useSearchParams();
  const filterEnums: FilterEnum[] = [
    {
      columnId: "isExistedTeam",
      title: "Loại ý tưởng",
      options: isExistedTeam_options.map(opt => ({
        ...opt,
        label: opt.label === "Existed Team" ? "Có nhóm" : "Chưa có nhóm"
      })),
    },
  ];

  // Table states
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
  });

  const [inputFields, setInputFields] = useState<z.infer<typeof defaultSchema>>();

  const queryParams: IdeaGetListOfSupervisorsQuery = useMemo(() => {
    const baseParams = useQueryParams(inputFields, columnFilters, pagination, sorting);
    return {
      ...baseParams,
      types: [IdeaType.Lecturer, IdeaType.Enterprise],
      status: IdeaStatus.Approved,
    };
  }, [inputFields, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || inputFields) {
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }
  }, [columnFilters, inputFields]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => ideaService.fetchAllIdeasOfSupervisors(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns,
    rowCount: data?.data?.totalPages ?? 0,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    setInputFields(values);
  };

  if (error) return (
    <div className="container mx-auto p-4">
      <Card className="p-6 text-center">
        <TypographyH2 className="text-destructive">Lỗi tải dữ liệu</TypographyH2>
        <p className="mt-2 text-muted-foreground">
          Đã xảy ra lỗi khi tải danh sách ý tưởng. Vui lòng thử lại sau.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetch()}
        >
          Thử lại
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <TypographyH2 className="text-primary">
          Danh sách Ý tưởng từ Giảng viên
        </TypographyH2>
        
        <Card className="max-w-md mx-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="englishName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tìm kiếm ý tưởng:</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Nhập tên ý tưởng..."
                          className="focus-visible:ring-1"
                          {...field}
                        />
                      </FormControl>
                      <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </Card>
      </div>

      {/* Data Table Section */}
      <Card className="p-4 md:p-6 space-y-2">
        <DataTableToolbar
          form={form}
          table={table}
          filterEnums={filterEnums}
          isCreateButton={false}
          isSelectColumns={false}
          isSortColumns={false}
        />
        
        {isFetching ? (
          <DataTableSkeleton
            columnCount={columns.length}
            rowCount={pagination.pageSize}
            showViewOptions={false}
            withPagination={true}
            searchableColumnCount={1}
            filterableColumnCount={1}
          />
        ) : (
          <>
            <DataTableComponent 
              table={table} 
            />
            <DataTablePagination 
              table={table} 
            />
          </>
        )}
      </Card>
    </div>
  );
}