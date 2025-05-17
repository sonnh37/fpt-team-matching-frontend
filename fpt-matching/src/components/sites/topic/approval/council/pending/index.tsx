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
import { topicVersionRequestService } from "@/services/topic-version-request-service";
import { stagetopicService } from "@/services/stage-topic-service";
import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { TopicVersionRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/topic-version-requests/topic-version-request-get-all-current-by-status-and-roles";
import { StageTopic } from "@/types/stage-topic";
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
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicGetListByStatusAndRoleQuery } from "@/types/models/queries/topics/topic-get-list-by-status-and-roles-query";

const defaultSchema = z.object({
  stageNumber: z.number().default(1).optional(),
});

export function TopicVersionRequestPendingByCouncilTable() {
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

  const queryParams: TopicGetListByStatusAndRoleQuery = useMemo(() => {
    const params: TopicGetListByStatusAndRoleQuery = useQueryParams(
      formValues,
      columnFilters,
      pagination,
      sorting
    );

    params.status = TopicVersionRequestStatus.Pending;
    params.topicStatus = TopicStatus.Pending;
    params.roles = ["Council"];

    return { ...params };
  }, [formValues, columnFilters, pagination, sorting]);

  useEffect(() => {
    if (columnFilters.length > 0 || formValues) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [columnFilters, formValues]);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: async () =>
      await topicService.getTopicsOfReviewerByRolesAndStatus(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error)
    return (
      <Alert variant="destructive" className="my-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </AlertDescription>
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

  const onSubmit = (values: z.infer<typeof defaultSchema>) => {};

  return (
    <div className="space-y-6 py-4">
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
              restore={topicVersionRequestService.restore}
              // deletePermanent={topicVersionRequestService.deletePermanent}
            />
            <DataTablePagination table={table} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
