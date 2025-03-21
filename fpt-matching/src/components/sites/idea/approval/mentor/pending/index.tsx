import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check, Search } from "lucide-react";
import { useQueryParams } from "@/hooks/use-query-params";
import { RootState } from "@/lib/redux/store";
import { cn } from "@/lib/utils";
import { ideaRequestService } from "@/services/idea-request-service";
import { stageideaService } from "@/services/stage-idea-service";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { FilterEnum } from "@/types/models/filter-enum";
import { IdeaRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status-and-roles";
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
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StageIdea } from "@/types/stage-idea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//#region INPUT
const defaultSchema = z.object({
  stageNumber: z.number().default(1).optional(),
});
//#endregion

export function IdeaRequestPendingByMentorTable() {
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

  const form = useForm<z.infer<typeof defaultSchema>>({
    resolver: zodResolver(defaultSchema),
    defaultValues: {
      stageNumber: 1, // Set giá trị mặc định là 0
    },
  });

  const formValues = useWatch({
    control: form.control,
  });
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) return null;

  // Query Params
  const queryParams: IdeaRequestGetAllCurrentByStatusAndRolesQuery =
    useMemo(() => {
      const params: IdeaRequestGetAllCurrentByStatusAndRolesQuery =
        useQueryParams(formValues, columnFilters, pagination, sorting);
      params.status = IdeaRequestStatus.Pending;
      params.roles = ["Mentor"];
      return { ...params };
    }, [formValues, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || formValues) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [columnFilters, formValues]);

  // Fetch Idea Requests
  const { data, isFetching, error } = useQuery({
    queryKey: ["data_idearequest_pending", formValues],
    queryFn: () =>
      ideaRequestService.GetIdeaRequestsCurrentByStatusAndRoles(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  // Fetch StageIdea
  const {
    data: res_stageIdea,
    isFetching: isFetchingStage,
    refetch: refetch_stage,
  } = useQuery({
    queryKey: ["stage_idea", formValues.stageNumber],
    queryFn: () =>
      stageideaService.fetchByStageNumber(formValues?.stageNumber ?? 0),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const stageIdea = res_stageIdea?.data ?? ({} as StageIdea);

  if (error) return <div>Error loading data</div>;

  // Table Configuration
  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns: columns,
    rowCount: data?.data?.totalRecords ?? 0,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    refetch_stage();
  };

  return (
    <div className="space-y-8 py-2">
      {/* Notification */}

      {/* Table */}
      <div className="space-y-4">
        <Card className={cn("w-[380px]")}>
          <CardHeader>
            <CardTitle>Notification Stage Ideas</CardTitle>
            <CardDescription>You have new review stages.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {stageIdea ? (
              <div className="space-y-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="stageNumber"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1, 2, 3, 4].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  Stage {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>

                <div className="space-y-1">
                  <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Timeline:{" "}
                        {new Date(stageIdea.startDate).toLocaleString()} -{" "}
                        {new Date(stageIdea.endDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Date of results:{" "}
                        {new Date(stageIdea.resultDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Không có thông báo mới.
              </p>
            )}
          </CardContent>
        </Card>
        <DataTableComponent
          table={table}
          restore={ideaRequestService.restore}
          deletePermanent={ideaRequestService.deletePermanent}
        />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
