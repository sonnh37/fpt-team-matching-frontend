import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
import { LoadingComponent } from "@/components/_common/loading-page";
import { Button } from "@/components/ui/button";
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
import { isDeleted_options } from "@/lib/filter-options";
import { userService } from "@/services/user-service";
import { FilterEnum } from "@/types/models/filter-enum";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
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
import { getEnumOptions } from "@/lib/utils";
import { Department } from "@/types/enums/user";
import { columns } from "./column";

const role_options = [
  { label: "Student", value: "Student" },
  { label: "Council", value: "Council" },
  { label: "Lecturer", value: "Lecturer" },
  { label: "Reviewer", value: "Reviewer" },
];
//#region INPUT
const defaultSchema = z.object({
  emailOrFullname: z.string().optional(),
});
//#endregion
export default function UserAssignmentRolesTable() {
  const searchParams = useSearchParams();

  const filterEnums: FilterEnum[] = [
    { columnId: "isDeleted", title: "Is deleted", options: isDeleted_options },
    {
      columnId: "department",
      title: "Department",
      options: getEnumOptions(Department),
      type: "single",
    },
  ];
  //#region DEFAULT
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdDate",
      desc: true,
    },
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
  const [isTyping, setIsTyping] = useState(false);
  //#endregion

  //#region CREATE TABLE
  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
  });

  // input field
  const [inputFields, setInputFields] =
    useState<z.infer<typeof defaultSchema>>();

  // default field in table
  const queryParams = useMemo(() => {
    const params: UserGetAllQuery = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );

    params.role = "Lecturer";

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
    queryFn: () => userService.getAll(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

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

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {};

  return (
    <>
      <div className="">
        <div className="w-fit mx-auto space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            ></form>
          </Form>
        </div>

        <div className="">
          <div className="space-y-4 p-4 mx-auto">
            <DataTableToolbar
              form={form}
              table={table}
              filterEnums={filterEnums}
              isSelectColumns={false}
              isSortColumns={false}
              // columnSearch={columnSearch}
              // handleSheetChange={handleSheetChange}
              // formFilterAdvanceds={formFilterAdvanceds}
            />
            <DataTableComponent
              isLoading={isFetching && !isTyping}
              table={table}
              restore={userService.restore}
              deletePermanent={userService.deletePermanent}
            />
            <DataTablePagination table={table} />
          </div>
        </div>
      </div>
    </>
  );
}
