import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { useQueryParams } from "@/hooks/use-query-params";
import { invitationService } from "@/services/invitation-service";
import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { InvitationGetByTypeQuery } from "@/types/models/queries/invitations/invitation-get-by-type-query";
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
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { LoadingComponent } from "@/components/_common/loading-page";

//#region INPUT
const defaultSchema = z.object({
  type: z.nativeEnum(InvitationType).optional(),
});
//#endregion
interface InvitationsInComingToLeaderTableProps {
  projectId: string;
}
export default function InvitationsInComingToLeaderTable({
  projectId,
}: InvitationsInComingToLeaderTableProps) {
  const searchParams = useSearchParams();
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
    pageSize: 5,
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
    const params: InvitationGetByTypeQuery = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );

    params.type = InvitationType.SentByStudent;
    params.status = InvitationStatus.Pending;
    params.projectId = projectId;

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
  const { data, isFetching, isLoading, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => invitationService.getLeaderInvitationsByType(queryParams),
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
    debugTable: true,
  });
  //#endregion

  if (error) return <div>Error loading data</div>;
  if (isLoading) return <LoadingComponent />;

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-3">
          <DataTableComponent table={table} />
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
}
