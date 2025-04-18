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
import { IdeaType } from "@/types/enums/idea";
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
import { IdeaRequestGetAllQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-query";
import { ideaRequestService } from "@/services/idea-request-service";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { Idea } from "@/types/idea";
import { IdeaRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status-and-roles";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

//#region INPUT
const defaultSchema = z.object({
  // englishName: z.string().optional(),
});
//#endregion
export default function IdeaRequestRejectedByMentorTable() {
  const searchParams = useSearchParams();
  const filterEnums: FilterEnum[] = [
    {
      columnId: "isExistedTeam",
      title: "Slot register",
      options: isExistedTeam_options,
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
  //#endregion

  //#region CREATE TABLE
  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
  });

  // input field
  const [inputFields, setInputFields] =
    useState<z.infer<typeof defaultSchema>>();

  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return null;
  }

  // default field in table
  const queryParams: IdeaRequestGetAllCurrentByStatusAndRolesQuery =
    useMemo(() => {
      const params: IdeaRequestGetAllCurrentByStatusAndRolesQuery =
        useQueryParams(inputFields, columnFilters, pagination, sorting);

      params.status = IdeaRequestStatus.Rejected;

      params.roles = ["Mentor"];

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
    queryFn: () =>
      ideaRequestService.GetIdeaRequestsCurrentByStatusAndRoles(queryParams),
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

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    setInputFields(values);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="">
          <DataTableComponent table={table} />
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
}
