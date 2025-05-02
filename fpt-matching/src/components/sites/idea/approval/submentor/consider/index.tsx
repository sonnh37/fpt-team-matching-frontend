import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { useQueryParams } from "@/hooks/use-query-params";
import { isExistedTeam_options } from "@/lib/filter-options";
import { ideaVersionRequestService } from "@/services/idea-version-request-service";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { FilterEnum } from "@/types/models/filter-enum";
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
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { columns } from "./columns";
import { Idea } from "@/types/idea";
import { IdeaVersionRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/idea-version-requests/idea-version-request-get-all-current-by-status-and-roles";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { useSelectorUser } from "@/hooks/use-auth";
import { IdeaGetListByStatusAndRoleQuery } from "@/types/models/queries/ideas/idea-get-list-by-status-and-roles-query";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";

//#region INPUT
const defaultSchema = z.object({
  // englishName: z.string().optional(),
});
//#endregion
export default function IdeaVersionRequestConsiderBySubMentorTable() {
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

  // default field in table
  const queryParams: IdeaGetListByStatusAndRoleQuery = useMemo(() => {
    const params: IdeaGetListByStatusAndRoleQuery = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );

    params.status = IdeaVersionRequestStatus.Consider;
    params.ideaStatus = IdeaStatus.ConsiderByMentor;
    params.roles = ["SubMentor"];

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
    queryFn: async () =>
      await ideaService.getIdeasOfReviewerByRolesAndStatus(queryParams),
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
