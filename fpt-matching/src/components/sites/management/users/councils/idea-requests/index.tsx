"use client";

import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
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
import { Separator } from "@/components/ui/separator";
import { useQueryParams } from "@/hooks/use-query-params";
import { userService } from "@/services/user-service";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
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
import * as React from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { columns } from "./columns";
import { semesterService } from "@/services/semester-service";
import { Badge } from "@/components/ui/badge";
import { getEnumOptions } from "@/lib/utils";
import { Department } from "@/types/enums/user";
import { FilterEnum } from "@/types/models/filter-enum";
import { z } from "zod";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";

const formSchema = z.object({
  searchTerm: z.string().optional(),
});

export default function CouncilTopicVersionRequestPendingTable() {
  // const searchParams = useSearchParams();
  const filterEnums: FilterEnum[] = [
    {
      columnId: "department",
      title: "Department",
      options: getEnumOptions(Department),
      type: "single",
    },
  ];
  //#region Table State
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  //#endregion

  //#region Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [searchTerm, setSearchTerm] = useState<string>();

  const queryParams = useMemo(() => {
    const params: UserGetAllQuery = useQueryParams(
      { emailOrFullname: searchTerm },
      columnFilters,
      pagination,
      sorting
    );
    return params;
  }, [searchTerm, columnFilters, pagination, sorting]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["get-all-user", queryParams],
    queryFn: () => userService.getAllByCouncilWithTopicVersionRequestPending(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const { data: res_semester } = useQuery({
    queryKey: ["get-current-semester"],
    queryFn: () => semesterService.getUpComingSemester(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
  //#endregion

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchTerm(values.searchTerm);
  };

  if (error) {
    return (
      <Card className="p-4 text-center text-destructive">
        Đã xảy ra lỗi khi tải danh sách giảng viên
      </Card>
    );
  }

  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns,
    pageCount: data?.data?.totalPages ?? -1,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="container mx-auto space-y-6 py-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <TypographyH2 className="text-primary">
              Danh sách hội đồng đang chấm
            </TypographyH2>
            <Badge variant="outline" className="text-sm font-normal">
              Học kỳ sắp tới: {res_semester?.data?.semesterName || "N/A"}
            </Badge>
          </div>

          <Separator />

          <Card className="mx-auto max-w-2xl p-6 shadow-sm">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="searchTerm"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="font-medium">
                        Tìm kiếm tên hội đồng
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Nhập tên hoặc email..."
                            {...field}
                            className="focus-visible:ring-1"
                          />
                        </FormControl>
                        <Button type="submit" variant="default">
                          <Search className="h-4 w-4" />
                          Tìm kiếm
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </Card>
          <div className="space-y-4 p-4 mx-auto">
            <DataTableToolbar
              form={form}
              table={table}
              filterEnums={filterEnums}
              isSelectColumns={false}
              isSortColumns={false}
              isCreateButton={false}
            />
            <DataTableComponent isLoading={isFetching} table={table} />
            <DataTablePagination table={table} />
          </div>
        </div>
      </Card>
    </div>
  );
}
