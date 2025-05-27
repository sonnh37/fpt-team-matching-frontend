import { DataTableComponent } from "@/components/_common/data-table-api/data-table-component";
import { DataTablePagination } from "@/components/_common/data-table-api/data-table-pagination";
import { DataTableSkeleton } from "@/components/_common/data-table-api/data-table-skelete";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-query-params";
import { professionService } from "@/services/profession-service";
import { Profession } from "@/types/profession";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Badge, CheckCircle, Loader2, Search, Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { columns } from "./columns";
import { DataTableToolbar } from "@/components/_common/data-table-api/data-table-toolbar";
import { FilterEnum } from "@/types/models/filter-enum";
import { isDeleted_options } from "@/lib/filter-options";
import { TopicGetListForMentorQuery } from "@/types/models/queries/topics/topic-get-list-for-mentor-query";
import { LoadingComponent } from "@/components/_common/loading-page";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { Topic } from "@/types/topic";
import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import {
  useCurrentRole,
  useCurrentSemester,
  useCurrentSemesterId,
} from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

//#region INPUT
const defaultSchema = z.object({
  emailOrFullname: z.string().optional(),
});

const roles_options = [
  { label: "Giảng viên hướng dẫn", value: "Mentor" },
  { label: "Giảng viên hướng dẫn 2", value: "SubMentor" },
];

//#endregion
interface TopicTableProps {
  statuses?: TopicStatus[];
}
export default function TopicTable({ statuses }: TopicTableProps) {
  const searchParams = useSearchParams();
  const role = useCurrentRole();
  const user = useSelectorUser();

  const getColumns = (statuses?: TopicStatus[]): ColumnDef<Topic>[] => {
    const updatedColumns = [...columns];
    const actionsIndex = updatedColumns.findIndex(
      (col) => col.id === "actions"
    );

    // Thêm cột trạng thái nhóm nếu cần
    if (
      actionsIndex !== -1 &&
      statuses?.includes(TopicStatus.ManagerApproved)
    ) {
      updatedColumns.splice(actionsIndex, 0, {
        accessorKey: "groupStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Trạng thái nhóm" />
        ),
        cell: ({ row }) => {
          const model = row.original;
          return model.project?.teamCode ? (
            <TypographyP>{model.project.teamCode}</TypographyP>
          ) : (
            <TypographyMuted className="text-red-500">
              Chưa có nhóm
            </TypographyMuted>
          );
        },
      });
    }

    // Thêm cột nộp vào CUỐI mảng (sau cột actions)
    if (statuses?.includes(TopicStatus.MentorApproved)) {
      updatedColumns.push({
        id: "submit",
        accessorKey: "submit",
        header: () => null,
        cell: ({ row }) => {
          const topic = row.original;
          const queryClient = useQueryClient();
          const [isSubmitting, setIsSubmitting] = useState(false);
          const [showConfirmDialog, setShowConfirmDialog] = useState(false);

          const handleSubmit = async () => {
            setIsSubmitting(true);
            try {
              if (!topic?.id) {
                toast.error("Topic ID is missing");
                return;
              }
              const res = await topicService.submitTopicOfStudentByLecturer(
                topic.id
              );
              if (res.status != 1) {
                toast.error(res.message);
                return;
              }

              toast.success(res.message);
              queryClient.refetchQueries({ queryKey: ["data"] });
            } catch (error: any) {
              toast.error(error?.message || "An unexpected error occurred");
            } finally {
              setIsSubmitting(false);
              setShowConfirmDialog(false);
            }
          };

          const hasManagerRequests =
            topic?.topicRequests?.some(
              (request) => request.role == "Manager"
            ) && role == "Mentor";

          const isMentorOfTopic = topic.mentorId == user?.id;

          if (!isMentorOfTopic) return null;

          return (
            <>
              <Button
                variant={hasManagerRequests ? "secondary" : "default"}
                size="sm"
                onClick={() => setShowConfirmDialog(true)}
                disabled={hasManagerRequests || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : hasManagerRequests ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {hasManagerRequests ? "Đã nộp" : "Nộp"}
              </Button>

              <Dialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận nộp đề tài</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Bạn có chắc chắn muốn nộp đề tài này?</p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmDialog(false)}
                        disabled={isSubmitting}
                      >
                        Hủy
                      </Button>
                      <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Xác nhận
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          );
        },
      });
    }

    return updatedColumns;
  };
  const filterEnums: FilterEnum[] = [
    { columnId: "roles", title: "Phân loại vị trí", options: roles_options },
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
    const params: TopicGetListForMentorQuery = useQueryParams(
      inputFields,
      columnFilters,
      pagination,
      sorting
    );

    params.statuses = statuses;

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
    queryFn: () => topicService.getAllForMentor(queryParams),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (error) return <div>Error loading data</div>;

  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns: getColumns(statuses),
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
      <div>
        <Card className="space-y-4 p-4">
          <DataTableToolbar
            form={form}
            table={table}
            filterEnums={filterEnums}
            isSelectColumns={false}
            isSortColumns={false}
            isCreateButton={false}
            // columnSearch={columnSearch}
            // handleSheetChange={handleSheetChange}
            // formFilterAdvanceds={formFilterAdvanceds}
          />

          <DataTableComponent
            isLoading={isFetching && !isTyping}
            table={table}
            restore={topicService.restore}
            deletePermanent={topicService.deletePermanent}
          />
          <DataTablePagination table={table} />
        </Card>
      </div>
    </>
  );
}
