import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { useQueryParams } from "@/hooks/use-query-params";
import { isExistedTeam_options } from "@/lib/filter-options";
import { ideaService } from "@/services/idea-service";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { FilterEnum } from "@/types/models/filter-enum";
import { IdeaRequestGetAllCurrentByStatusQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status";
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
import { ideaRequestService } from "@/services/idea-request-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { DataOnlyTable } from "@/components/_common/data-table-client/data-table";

//#region INPUT
const defaultSchema = z.object({
  // englishName: z.string().optional(),
});
//#endregion
export default function IdeaRequestRejectedTable() {
  const queryParams: IdeaGetCurrentByStatusQuery = {
    status: IdeaStatus.Rejected,
  };

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => ideaService.getCurrentIdeaOfMeByStatus(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

  return (
    <>
      <div className="space-y-8">
        <div className="">
          <DataOnlyTable data={data?.data ?? []} columns={columns} />
        </div>
      </div>
    </>
  );
}
