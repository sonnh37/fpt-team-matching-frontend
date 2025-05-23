import { AlertMessage } from "@/components/_common/alert-message";
import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { useQueryParams } from "@/hooks/use-query-params";
import { isExistedTeam_options } from "@/lib/filter-options";
import { topicService } from "@/services/topic-service";
import { semesterService } from "@/services/semester-service";
import { TopicStatus, TopicType } from "@/types/enums/topic";
import { FilterEnum } from "@/types/models/filter-enum";
import { TopicGetListOfSupervisorsQuery } from "@/types/models/queries/topics/topic-get-list-of-supervisor-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTopicColumns } from "./columns";

const defaultSchema = z.object({
  englishName: z.string().optional(),
});

export default function TopicsOfSupervisorsTable() {
  const searchParams = useSearchParams();
  const columns = useTopicColumns();
  const filterEnums: FilterEnum[] = [
    {
      columnId: "isExistedTeam",
      title: "Trạng thái nhóm",
      options: isExistedTeam_options,
    },
  ];

  // Table states
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
  });

  const [inputFields, setInputFields] =
    useState<z.infer<typeof defaultSchema>>();

  const queryParams: TopicGetListOfSupervisorsQuery = useMemo(() => {
    const baseParams = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );
    return {
      ...baseParams,
    };
  }, [inputFields, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || inputFields) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [columnFilters, inputFields]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["topics-of-supervisors", queryParams],
    queryFn: () => topicService.getAllTopicsOfSupervisors(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

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
  });

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    setInputFields(values);
  };

  if (error) return <ErrorSystem />;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <TypographyH2 className="text-primary">
          Danh Sách đề tài Từ Giảng Viên
        </TypographyH2>

      </div>

      {/* Search Card */}
      <Card className="mx-auto max-w-2xl p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="englishName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Tìm kiếm ý tưởng
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Nhập tên ý tưởng bằng tiếng Anh..."
                        className="focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <Button type="submit" className="gap-2">
                      <Search className="h-4 w-4" />
                      <span>Tìm kiếm</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>

      {/* Data Table Section */}
      <Card className="overflow-hidden">
        <div className="p-4 md:p-6 space-y-4">
          <DataTableToolbar
            form={form}
            table={table}
            filterEnums={filterEnums}
            isCreateButton={false}
            isSelectColumns={false}
            isSortColumns={false}
          />

          <Separator />

          <DataTableComponent isLoading={isFetching} table={table} />

          <DataTablePagination table={table} />
        </div>
      </Card>
    </div>
  );
}
