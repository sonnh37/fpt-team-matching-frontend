"use client";
import { useQuery } from "@tanstack/react-query";
import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-query-params";
import { RootState } from "@/lib/redux/store";
import { cn, formatDate } from "@/lib/utils";
import { ideaRequestService } from "@/services/idea-request-service";
import { stageideaService } from "@/services/stage-idea-service";
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { IdeaRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status-and-roles";
import { StageIdea } from "@/types/stage-idea";
import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData } from "@tanstack/react-query";
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
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const defaultSchema = z.object({
  stageNumber: z.number().default(1).optional(),
});

export function IdeaRequestPendingByCouncilTable() {
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
      stageNumber: 1,
    },
  });

  const formValues = useWatch({
    control: form.control,
  });
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) return null;

  const queryParams: IdeaRequestGetAllCurrentByStatusAndRolesQuery =
    useMemo(() => {
      const params: IdeaRequestGetAllCurrentByStatusAndRolesQuery =
        useQueryParams(formValues, columnFilters, pagination, sorting);
      params.status = IdeaRequestStatus.Pending;
      params.roles = ["Council"];
      return { ...params };
    }, [formValues, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || formValues) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [columnFilters, formValues]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["data_idearequest_pending", formValues],
    queryFn: () =>
      ideaRequestService.GetIdeaRequestsCurrentByStatusAndRoles(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const {
    data: res_stageIdea,
    isFetching: isFetchingStage,
    refetch: refetch_stage,
  } = useQuery({
    queryKey: ["stage_idea_latest"],
    queryFn: () =>
      stageideaService.getCurrentStageIdea(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const stageIdea = res_stageIdea?.data ?? ({} as StageIdea);

  if (error) return (
    <Alert variant="destructive" className="my-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Lỗi</AlertTitle>
      <AlertDescription>Không thể tải dữ liệu. Vui lòng thử lại sau.</AlertDescription>
    </Alert>
  );

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

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {
    refetch_stage();
  };

  return (
    <div className="space-y-6 py-4">
      {/* Thông báo giai đoạn */}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Thông tin Giai đoạn Đánh giá
          </CardTitle>
          <CardDescription>
            Các yêu cầu ý tưởng đang chờ phê duyệt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stageIdea ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-full w-px bg-border" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Thời gian đánh giá:{" "}
                    <Badge variant="outline" className="ml-2">
                      {formatDate(stageIdea.startDate)} - {formatDate(stageIdea.endDate)}
                    </Badge>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Ngày công bố kết quả:{" "}
                    <Badge variant="outline" className="ml-2">
                      {formatDate(stageIdea.resultDate)}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Không có thông tin</AlertTitle>
              <AlertDescription>
                Hiện không có giai đoạn đánh giá nào đang diễn ra.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Bảng dữ liệu */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Danh sách Yêu cầu
            </CardTitle>
            <CardDescription>
              Các yêu cầu ý tưởng đang chờ xét duyệt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTableComponent
              table={table}
              restore={ideaRequestService.restore}
              // deletePermanent={ideaRequestService.deletePermanent}
            />
            <DataTablePagination table={table} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}